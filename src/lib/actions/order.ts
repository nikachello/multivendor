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

export const createOrder = async (
  shopId: string,
  items: CartItem[],
  rawForm: OrderFormData,
) => {
  if (!shopId || items.length === 0)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Missing required data",
      status: 400,
    });

  const shopDetails = await prisma.shop.findFirst({ where: { id: shopId } });
  if (!shopDetails)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Shop not found",
      status: 404,
    });

  const parsed = orderSchema.safeParse(rawForm);
  if (!parsed.success)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Invalid form data",
      status: 400,
    });
  const form = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const shippingCost = calcShipping(
    subtotal,
    form.city,
    Number(shopDetails.shippingRate),
    Number(shopDetails.freeThreshold),
    (shopDetails.shippingZones as ShippingZone[]) ?? [],
  );

  const total = subtotal + shippingCost;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Pre-check stock for tracked variants
      for (const item of items) {
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, trackInventory: true },
        });
        if (variant?.trackInventory && (variant.stock ?? 0) < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.productName}`);
        }
      }

      const created = await tx.order.create({
        data: {
          shopId,
          customerId: session?.user.id ?? null,
          customerEmail: form.email,
          customerPhone: form.phone ?? null,
          subtotal,
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
        data: items.map((item) => ({
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

      await Promise.all(
        items.map((item) =>
          tx.variant.updateMany({
            where: { id: item.variantId, trackInventory: true },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      return created;
    });

    try {
      await sendOrderConfirmation({
        to: form.email,
        shopName: shopDetails.name,
        orderId: order.id,
        customerName: form.fullName,
        items: items.map((item) => ({
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
      // Email failure should not fail the order
    }

    return ok({ id: order.id });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("INSUFFICIENT_STOCK:")) {
      const name = e.message.replace("INSUFFICIENT_STOCK:", "");
      return err({
        code: ErrorCode.GENERAL_ERROR,
        message: `"${name}" is out of stock`,
        status: 409,
      });
    }
    return err({
      code: ErrorCode.ORDER_CREATE_FAILED,
      message: "Failed to place order",
      status: 500,
    });
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  shopId: string,
) => {
  if (!orderId || !status || !shopId)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Missing required data",
      status: 400,
    });

  try {
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { shopId: true },
    });

    if (!existing || existing.shopId !== shopId)
      return err({
        code: ErrorCode.ORDER_NOT_FOUND,
        message: "Order not found",
        status: 404,
      });

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { shop: { select: { name: true, currency: true } } },
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
        // Email failure should not fail the status update
      }
    }

    return ok(order);
  } catch {
    return err({
      code: ErrorCode.ORDER_NOT_FOUND,
      message: "Order not found",
      status: 404,
    });
  }
};
