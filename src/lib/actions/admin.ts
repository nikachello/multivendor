"use server";

import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { err, ok } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { OrderStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function setShopActive(shopId: string, active: boolean) {
  try { await assertAdmin(); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.shop.update({ where: { id: shopId }, data: { isActive: active } });
  revalidatePath("/admin/shops");
  return ok(null);
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
  } catch {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Order not found", status: 404 });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return ok(null);
}
