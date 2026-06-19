"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { CartItem } from "../types/data-types";
import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { orderSchema, OrderFormData } from "../validations/order";

export const createOrder = async (
  shopId: string,
  items: CartItem[],
  rawForm: OrderFormData,
) => {
  if (!shopId || items.length === 0) return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required data", status: 400 });

  const parsed = orderSchema.safeParse(rawForm);
  if (!parsed.success) return err({ code: ErrorCode.GENERAL_ERROR, message: "Invalid form data", status: 400 });
  const form = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  try {
    const order = await prisma.order.create({
      data: {
        shopId,
        customerId: session?.user.id ?? null,
        customerEmail: form.email,
        customerPhone: form.phone ?? null,
        subtotal,
        total: subtotal,
        shippingAddress: {
          name: form.fullName,
          line1: form.line1,
          line2: form.line2 ?? "",
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
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

    return ok({ id: order.id });
  } catch {
    return err({ code: ErrorCode.ORDER_CREATE_FAILED, message: "Failed to place order", status: 500 });
  }
};
