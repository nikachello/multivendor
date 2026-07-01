"use server";

import prisma from "@/lib/db/prisma";

type EventType = "view" | "add_to_cart" | "checkout" | "purchase";

export async function recordEvent(
  shopId: string,
  type: EventType,
  sessionId: string,
  productId?: string,
  value?: number,
) {
  if (!shopId || !sessionId) return;
  await prisma.analyticsEvent.create({
    data: {
      shopId,
      type,
      sessionId,
      productId: productId ?? null,
      value: value ?? null,
    },
  });
}
