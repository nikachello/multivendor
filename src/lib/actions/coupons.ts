"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";
import { isProShop } from "../subscription";
import { CouponType } from "@/generated/prisma/client";

export async function getCouponsByShop(shopId: string) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const coupons = await prisma.coupon.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
  });
  return ok(coupons);
}

export async function createCoupon(
  shopId: string,
  data: {
    code: string;
    type: CouponType;
    value: number;
    minOrderAmount?: number | null;
    maxUses?: number | null;
    expiresAt?: string | null;
  },
) {
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shopData = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
  if (!isProShop(shopData?.subscriptionPaidUntil)) {
    return err({ code: ErrorCode.PLAN_LIMIT_REACHED, message: "Coupons require a Pro subscription.", status: 403 });
  }

  const code = data.code.trim().toUpperCase();
  if (!code) return err({ code: ErrorCode.GENERAL_ERROR, message: "Code is required", status: 400 });

  const existing = await prisma.coupon.findUnique({ where: { shopId_code: { shopId, code } } });
  if (existing) return err({ code: ErrorCode.GENERAL_ERROR, message: "Coupon code already exists", status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      shopId,
      code,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount ?? null,
      maxUses: data.maxUses ?? null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
  return ok(coupon);
}

export async function updateCoupon(
  couponId: string,
  data: {
    isActive?: boolean;
    maxUses?: number | null;
    expiresAt?: string | null;
    minOrderAmount?: number | null;
  },
) {
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId }, select: { shopId: true } });
  if (!coupon) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(coupon.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const patch: {
    isActive?: boolean;
    maxUses?: number | null;
    expiresAt?: Date | null;
    minOrderAmount?: number | null;
  } = {};
  if (data.isActive !== undefined) patch.isActive = data.isActive;
  if (data.maxUses !== undefined) patch.maxUses = data.maxUses;
  if (data.expiresAt !== undefined) patch.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  if (data.minOrderAmount !== undefined) patch.minOrderAmount = data.minOrderAmount;

  const updated = await prisma.coupon.update({
    where: { id: couponId },
    data: patch,
  });
  return ok(updated);
}

export async function deleteCoupon(couponId: string) {
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId }, select: { shopId: true } });
  if (!coupon) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(coupon.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.coupon.delete({ where: { id: couponId } });
  return ok(null);
}

export async function validateCoupon(shopId: string, code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { shopId_code: { shopId, code: code.trim().toUpperCase() } },
  });

  if (!coupon || !coupon.isActive)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid or inactive coupon", status: 404 });
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Coupon has expired", status: 410 });
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Coupon has reached its usage limit", status: 410 });
  if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount))
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: `Minimum order amount is ${Number(coupon.minOrderAmount).toFixed(2)}`,
      status: 422,
    });

  const discount =
    coupon.type === "percentage"
      ? Math.min(subtotal, (subtotal * Number(coupon.value)) / 100)
      : Math.min(subtotal, Number(coupon.value));

  return ok({ coupon, discount: Math.round(discount * 100) / 100 });
}
