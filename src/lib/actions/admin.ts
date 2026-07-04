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

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return ok(null);
}
