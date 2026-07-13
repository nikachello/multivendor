"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";

async function getShopIdForProduct(productId: string) {
  const p = await prisma.product.findUnique({ where: { id: productId }, select: { shopId: true } });
  return p?.shopId ?? null;
}

async function getShopIdForOptionType(optionTypeId: string) {
  const ot = await prisma.optionType.findUnique({
    where: { id: optionTypeId },
    select: { product: { select: { shopId: true } } },
  });
  return ot?.product.shopId ?? null;
}

export async function addOptionType(productId: string, name: string) {
  if (!name.trim()) return err({ code: ErrorCode.GENERAL_ERROR, message: "Name is required", status: 400 });

  const shopId = await getShopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Product not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const optionType = await prisma.optionType.upsert({
    where: { productId_name: { productId, name: name.trim() } },
    create: { productId, name: name.trim() },
    update: {},
  });

  return ok(optionType);
}

export async function addOptionValues(optionTypeId: string, values: string[]) {
  const trimmed = values.map((v) => v.trim()).filter(Boolean);
  if (!trimmed.length) return ok([] as { id: string; value: string }[]);

  const shopId = await getShopIdForOptionType(optionTypeId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const results = await Promise.all(
    trimmed.map((v) =>
      prisma.optionValue.upsert({
        where: { optionTypeId_value: { optionTypeId, value: v } },
        create: { optionTypeId, value: v },
        update: {},
      }),
    ),
  );

  return ok(results.map((r) => ({ id: r.id, value: r.value })));
}

export async function removeOptionType(productId: string, optionTypeId: string) {
  const shopId = await getShopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  // Delete all variants of this product — they reference option values of this type
  // (OptionType cascade deletes OptionValues → VariantOptionValues, but not Variants themselves)
  await prisma.$transaction([
    prisma.variant.deleteMany({ where: { productId } }),
    prisma.optionType.delete({ where: { id: optionTypeId } }),
  ]);

  return ok(null);
}

export async function removeOptionValue(optionValueId: string) {
  const shopId = await getShopIdForOptionType(
    (await prisma.optionValue.findUnique({ where: { id: optionValueId }, select: { optionTypeId: true } }))?.optionTypeId ?? ""
  );
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const affected = await prisma.variantOptionValue.findMany({
    where: { optionValueId },
    select: { variantId: true },
  });

  await prisma.optionValue.delete({ where: { id: optionValueId } });

  if (affected.length > 0) {
    await prisma.variant.deleteMany({
      where: { id: { in: affected.map((v) => v.variantId) } },
    });
  }

  return ok(null);
}
