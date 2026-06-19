"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";

function cartesian(arrays: { id: string; value: string }[][]): { id: string; value: string }[][] {
  return arrays.reduce<{ id: string; value: string }[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((val) => [...combo, val])),
    [[]],
  );
}

export async function generateVariants(productId: string, priceFrom: number) {
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

  let created = 0;
  for (const combo of combinations) {
    const key = combo.map((v) => v.id).sort().join("|");
    if (existingKeys.has(key)) continue;

    const sku = combo.map((v) => v.value.slice(0, 3).toUpperCase()).join("-");

    await prisma.variant.create({
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

  return ok({ created });
}

export async function updateVariant(
  variantId: string,
  price: number,
  stock: number,
  sku: string,
  trackInventory: boolean,
) {
  const variant = await prisma.variant.update({
    where: { id: variantId },
    data: { price, stock, sku, trackInventory },
  });
  return ok(variant);
}

export async function deleteVariant(variantId: string) {
  await prisma.variant.delete({ where: { id: variantId } });
  return ok(null);
}
