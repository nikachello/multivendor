"use server";

import prisma from "@/lib/db/prisma";

const VALID_TYPES = new Set(["view", "add_to_cart", "checkout", "purchase"]);

export async function recordEvent(
  shopId: string,
  type: string,
  sessionId: string,
  productId?: string,
  value?: number,
) {
  if (!shopId || !sessionId) return;
  if (!VALID_TYPES.has(type)) return;
  if (value !== undefined && (typeof value !== "number" || !isFinite(value) || value < 0)) return;

  // Verify the shop exists and is active — prevents fabricating events for arbitrary shop IDs
  const shop = await prisma.shop.findUnique({
    where: { id: shopId, isActive: true },
    select: { id: true },
  });
  if (!shop) return;

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
