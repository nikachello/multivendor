"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { CartItem } from "../types/data-types";
import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { orderSchema, OrderFormData } from "../validations/order";
import { OrderStatus } from "@/generated/prisma/client";
import { sendOrderConfirmation, sendOrderStatusUpdate } from "../email";
import { ShippingZone } from "./shop";
import { assertOwnsShop } from "../auth/assert-owns-shop";

const round2 = (n: number) => Math.round(n * 100) / 100;

function calcShipping(
  subtotal: number,
  city: string,
  defaultRate: number,
  freeThreshold: number,
  zones: ShippingZone[],
): number {
  if (freeThreshold > 0 && subtotal >= freeThreshold) return 0;
  const zone = zones.find((z) => z.city_en === city);
  return zone ? zone.rate : defaultRate;
}

// Statuses that mean the order won't be fulfilled — stock should be returned
const STOCK_RESTORING_STATUSES: OrderStatus[] = ["cancelled", "refunded"];

export const createOrder = async (
  shopId: string,
  items: CartItem[],
  rawForm: OrderFormData,
  couponCode?: string,
) => {
  if (!shopId || items.length === 0)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required data", status: 400 });

  if (items.length > 50)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Too many items in cart", status: 400 });

  if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 100))
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid item quantity", status: 400 });

  const shopDetails = await prisma.shop.findFirst({ where: { id: shopId } });
  if (!shopDetails)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Shop not found", status: 404 });

  const parsed = orderSchema.safeParse(rawForm);
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid form data", status: 400 });
  const form = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });

  try {
    const { order, verifiedItems, total } = await prisma.$transaction(async (tx) => {
      // Re-fetch all variant data from DB — never trust client-supplied prices
      const dbVariants = await tx.variant.findMany({
        where: { id: { in: items.map((i) => i.variantId) } },
        select: {
          id: true,
          price: true,
          stock: true,
          trackInventory: true,
          product: { select: { shopId: true } },
        },
      });

      const variantMap = new Map(dbVariants.map((v) => [v.id, v]));

      // Ensure every variant belongs to this shop (prevents cross-shop cart manipulation)
      for (const v of dbVariants) {
        if (v.product.shopId !== shopId) throw new Error("FORBIDDEN");
      }

      // Build verified items using DB prices
      const verifiedItems = items.map((item) => {
        const v = variantMap.get(item.variantId);
        if (!v) throw new Error(`PRODUCT_NOT_FOUND:${item.productName}`);
        return { ...item, price: Number(v.price) };
      });

      const subtotal = round2(verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

      // Apply coupon if provided — validate inside transaction for consistency
      let discount = 0;
      let couponId: string | null = null;
      if (couponCode) {
        const code = couponCode.trim().toUpperCase();
        const coupon = await tx.coupon.findUnique({
          where: { shopId_code: { shopId, code } },
        });
        const isValid =
          !!coupon &&
          coupon.isActive &&
          (!coupon.expiresAt || coupon.expiresAt >= new Date()) &&
          (coupon.minOrderAmount === null || subtotal >= Number(coupon.minOrderAmount));
        if (!isValid) throw new Error("COUPON_INVALID");

        discount =
          coupon.type === "percentage"
            ? round2(Math.min(subtotal, (subtotal * Number(coupon.value)) / 100))
            : round2(Math.min(subtotal, Number(coupon.value)));
        couponId = coupon.id;

        // Atomic conditional increment — only succeeds if usage cap not already hit,
        // closing the check-then-increment race under concurrent checkouts.
        const claimed = await tx.coupon.updateMany({
          where: {
            id: coupon.id,
            OR: [{ maxUses: null }, { usedCount: { lt: coupon.maxUses ?? 0 } }],
          },
          data: { usedCount: { increment: 1 } },
        });
        if (claimed.count === 0) throw new Error("COUPON_INVALID");
      }

      const shippingCost = calcShipping(
        subtotal,
        form.city,
        Number(shopDetails.shippingRate),
        Number(shopDetails.freeThreshold),
        (shopDetails.shippingZones as ShippingZone[]) ?? [],
      );
      const total = round2(subtotal - discount + shippingCost);

      // Atomic stock check + decrement in one query per variant — prevents race conditions.
      // The WHERE clause (stock >= quantity) ensures we only decrement when stock is sufficient;
      // count === 0 means either out of stock or the variant doesn't track inventory (handled by
      // the trackInventory check first).
      for (const item of verifiedItems) {
        const v = variantMap.get(item.variantId)!;
        if (!v.trackInventory) continue;
        const result = await tx.variant.updateMany({
          where: { id: item.variantId, trackInventory: true, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) throw new Error(`INSUFFICIENT_STOCK:${item.productName}`);
      }

      const created = await tx.order.create({
        data: {
          shopId,
          customerId: session?.user.id ?? null,
          customerEmail: form.email,
          customerPhone: form.phone ?? null,
          subtotal,
          discount: discount > 0 ? discount : null,
          couponId,
          total,
          notes: form.notes ?? null,
          shippingAddress: {
            name: form.fullName,
            line1: form.line1,
            line2: form.line2 ?? "",
            city: form.city,
            postalCode: form.postalCode ?? "",
            country: "Georgia",
          },
        },
      });

      await tx.orderItem.createMany({
        data: verifiedItems.map((item) => ({
          orderId: created.id,
          variantId: item.variantId,
          productId: item.productId,
          productName: item.productName,
          variantOptions: item.variantOptions,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
        })),
      });

      return { order: created, verifiedItems, total };
    });

    try {
      await sendOrderConfirmation({
        to: form.email,
        shopName: shopDetails.name,
        orderId: order.id,
        customerName: form.fullName,
        items: verifiedItems.map((item) => ({
          productName: item.productName,
          variantOptions: Object.entries(item.variantOptions)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", "),
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        currency: shopDetails.currency,
        shippingAddress: {
          name: form.fullName,
          line1: form.line1,
          city: form.city,
          country: "Georgia",
        },
      });
    } catch {
      // Email failure must not fail the order
    }

    return ok({ id: order.id, total });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("INSUFFICIENT_STOCK:")) {
      const name = e.message.replace("INSUFFICIENT_STOCK:", "");
      return err({ code: ErrorCode.GENERAL_ERROR, message: `"${name}" is out of stock`, status: 409 });
    }
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid cart items", status: 403 });
    }
    if (e instanceof Error && e.message === "COUPON_INVALID") {
      return err({
        code: ErrorCode.GENERAL_ERROR,
        message: "This coupon is no longer valid. Please remove it and try again.",
        status: 409,
      });
    }
    if (e instanceof Error && e.message.startsWith("PRODUCT_NOT_FOUND:")) {
      const name = e.message.replace("PRODUCT_NOT_FOUND:", "");
      return err({ code: ErrorCode.GENERAL_ERROR, message: `"${name}" is no longer available. Please remove it from your cart.`, status: 409 });
    }
    return err({ code: ErrorCode.ORDER_CREATE_FAILED, message: "Failed to place order", status: 500 });
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  shopId: string,
) => {
  if (!orderId || !status || !shopId)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required data", status: 400 });

  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          shopId: true,
          status: true,
          items: { select: { variantId: true, quantity: true } },
        },
      });

      if (!existing || existing.shopId !== shopId) throw new Error("ORDER_NOT_FOUND");

      // Gate the transition on the order's CURRENT status so a concurrent/duplicate
      // transition can't restore stock twice for the same order.
      const updated = await tx.order.updateMany({
        where: { id: orderId, shopId, status: existing.status },
        data: { status },
      });
      if (updated.count === 0) throw new Error("ORDER_NOT_FOUND");

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

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { shop: { select: { name: true, currency: true } } },
      });
    });

    if (order.customerEmail) {
      const address = order.shippingAddress as { name?: string };
      try {
        await sendOrderStatusUpdate({
          to: order.customerEmail,
          shopName: order.shop.name,
          orderId: order.id,
          customerName: address?.name ?? order.customerEmail,
          status,
          currency: order.shop.currency,
          total: Number(order.total),
        });
      } catch {
        // Email failure must not fail the status update
      }
    }

    return ok(order);
  } catch {
    return err({ code: ErrorCode.ORDER_NOT_FOUND, message: "Order not found", status: 404 });
  }
};
