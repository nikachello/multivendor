"use server";

import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { err, ok } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { OrderStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { logger } from "../logger";

export async function setShopActive(shopId: string, active: boolean) {
  try { await assertAdmin(); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.shop.update({ where: { id: shopId }, data: { isActive: active } });
  revalidatePath("/admin/shops");
  return ok(null);
}

export async function adminExtendSubscription(shopId: string, days: number) {
  try { await assertAdmin(); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  if (!Number.isInteger(days) || days < 1 || days > 365)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Days must be 1–365", status: 400 });

  const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
  if (!shop) return err({ code: ErrorCode.GENERAL_ERROR, message: "Shop not found", status: 404 });

  const base = shop.subscriptionPaidUntil && shop.subscriptionPaidUntil > new Date()
    ? new Date(shop.subscriptionPaidUntil)
    : new Date();
  const paidUntil = new Date(base);
  paidUntil.setDate(paidUntil.getDate() + days);

  await prisma.shop.update({ where: { id: shopId }, data: { subscriptionPaidUntil: paidUntil } });
  revalidatePath("/admin/shops");
  revalidatePath(`/admin/shops/${shopId}`);
  return ok({ paidUntil });
}

export async function adminUpdateOrderStatus(orderId: string, status: OrderStatus) {
  try { await assertAdmin(); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const STOCK_RESTORING_STATUSES: OrderStatus[] = ["cancelled", "refunded"];

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          status: true,
          items: { select: { variantId: true, quantity: true } },
        },
      });
      if (!existing) throw new Error("NOT_FOUND");

      await tx.order.update({ where: { id: orderId }, data: { status } });

      const shouldRestoreStock =
        STOCK_RESTORING_STATUSES.includes(status) &&
        !STOCK_RESTORING_STATUSES.includes(existing.status);

      if (shouldRestoreStock) {
        await Promise.all(
          existing.items.map((item) =>
            tx.variant.updateMany({
              where: { id: item.variantId, trackInventory: true },
              data: { stock: { increment: item.quantity } },
            }),
          ),
        );
      }
    });
  } catch (e) {
    logger.error("action.adminUpdateOrderStatus", { orderId, status }, e);
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Order not found", status: 404 });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return ok(null);
}
