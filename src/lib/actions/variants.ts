"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";

function cartesian(arrays: { id: string; value: string }[][]): { id: string; value: string }[][] {
  return arrays.reduce<{ id: string; value: string }[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((val) => [...combo, val])),
    [[]],
  );
}

async function shopIdForProduct(productId: string) {
  const p = await prisma.product.findUnique({ where: { id: productId }, select: { shopId: true } });
  return p?.shopId ?? null;
}

async function shopIdForVariant(variantId: string) {
  const v = await prisma.variant.findUnique({
    where: { id: variantId },
    select: { product: { select: { shopId: true } } },
  });
  return v?.product.shopId ?? null;
}

export async function generateVariants(productId: string, priceFrom: number) {
  const shopId = await shopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const optionTypes = await prisma.productOptionType.findMany({
    where: { productId },
    include: { optionType: { include: { values: true } } },
    orderBy: { position: "asc" },
  });

  if (optionTypes.length === 0) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "No options defined", status: 400 });
  }

  const valueSets = optionTypes.map((ot) =>
    ot.optionType.values.map((v) => ({ id: v.id, value: v.value })),
  );

  if (valueSets.some((s) => s.length === 0)) {
    return err({ code: ErrorCode.GENERAL_ERROR, message: "All options must have at least one value", status: 400 });
  }

  const combinations = cartesian(valueSets);

  const existing = await prisma.variant.findMany({
    where: { productId },
    include: { optionValues: { select: { optionValueId: true } } },
  });

  const existingKeys = new Set(
    existing.map((v) =>
      v.optionValues
        .map((ov) => ov.optionValueId)
        .sort()
        .join("|"),
    ),
  );

  // Track SKUs across existing variants AND ones being generated this run
  // to avoid (productId, sku) unique constraint violations when option values
  // share the same 3-char prefix (e.g. "Red" and "Rose" → both "ROS").
  const usedSkus = new Set(existing.map((v) => v.sku));

  let created = 0;
  await prisma.$transaction(async (tx) => {
    for (const combo of combinations) {
      const key = combo.map((v) => v.id).sort().join("|");
      if (existingKeys.has(key)) continue;

      const baseSku = combo.map((v) => v.value.slice(0, 3).toUpperCase()).join("-");
      let sku = baseSku;
      let suffix = 2;
      while (usedSkus.has(sku)) {
        sku = `${baseSku}-${suffix++}`;
      }
      usedSkus.add(sku);

      await tx.variant.create({
        data: {
          productId,
          sku,
          price: priceFrom,
          stock: 0,
          optionValues: {
            create: combo.map((v) => ({ optionValueId: v.id })),
          },
        },
      });
      created++;
    }
  });

  return ok({ created });
}

export async function updateVariant(
  variantId: string,
  price: number,
  stock: number,
  sku: string,
  trackInventory: boolean,
) {
  const shopId = await shopIdForVariant(variantId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const variant = await prisma.variant.update({
    where: { id: variantId },
    data: { price, stock, sku, trackInventory },
  });
  return ok(variant);
}

export async function updateVariants(
  updates: { id: string; price: number; compareAtPrice?: number | null; stock: number; sku: string; trackInventory: boolean }[],
) {
  if (!updates.length) return ok(null);

  // Resolve the owning shop for EVERY variant — must all belong to one shop the caller owns.
  const rows = await prisma.variant.findMany({
    where: { id: { in: updates.map((u) => u.id) } },
    select: { id: true, product: { select: { shopId: true } } },
  });
  if (rows.length !== updates.length)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });

  const shopIds = new Set(rows.map((r) => r.product.shopId));
  if (shopIds.size !== 1)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 });

  const [shopId] = shopIds;
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.$transaction(
    updates.map((u) =>
      prisma.variant.updateMany({
        where: { id: u.id, product: { shopId } },
        data: { price: u.price, compareAtPrice: u.compareAtPrice ?? null, stock: u.stock, sku: u.sku, trackInventory: u.trackInventory },
      }),
    ),
  );
  return ok(null);
}

export async function deleteVariant(variantId: string) {
  const shopId = await shopIdForVariant(variantId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const orderItemCount = await prisma.orderItem.count({ where: { variantId } });
  if (orderItemCount > 0)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "This variant has order history and cannot be deleted.", status: 409 });

  await prisma.variant.delete({ where: { id: variantId } });
  return ok(null);
}
