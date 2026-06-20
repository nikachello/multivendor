"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { CartItem } from "../types/data-types";
import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { orderSchema, OrderFormData } from "../validations/order";
import { OrderStatus } from "@/generated/prisma/client";
import { sendOrderConfirmation } from "../email";
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
    Number(shopDetails?.shippingRate ?? 0),
    Number(shopDetails?.freeThreshold ?? 0),
    (shopDetails?.shippingZones as ShippingZone[]) ?? [],
  );

  const total = subtotal + shippingCost;

  try {
    const order = await prisma.order.create({
      data: {
        shopId,
        customerId: session?.user.id ?? null,
        customerEmail: form.email,
        customerPhone: form.phone ?? null,
        subtotal,
        total,
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

    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId: order.id,
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
        prisma.variant.updateMany({
          where: { id: item.variantId, trackInventory: true },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    sendOrderConfirmation({
      to: form.email,
      shopName: shopDetails?.name ?? "Store",
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
      currency: shopDetails?.currency ?? "GEL",
      shippingAddress: {
        name: form.fullName,
        line1: form.line1,
        city: form.city,
        country: "Georgia",
      },
    });

    return ok({ id: order.id });
  } catch {
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
) => {
  if (!orderId || !status)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Missing required data",
      status: 400,
    });

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return ok(order);
  } catch {
    return err({
      code: ErrorCode.ORDER_NOT_FOUND,
      message: "Order not found",
      status: 404,
    });
  }
};
