"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";

export async function addOptionType(productId: string, shopId: string, name: string) {
  if (!name.trim()) return err({ code: ErrorCode.GENERAL_ERROR, message: "Name is required", status: 400 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const optionType = await prisma.optionType.upsert({
    where: { shopId_name: { shopId, name: name.trim() } },
    create: { shopId, name: name.trim() },
    update: {},
  });

  await prisma.productOptionType.upsert({
    where: { productId_optionTypeId: { productId, optionTypeId: optionType.id } },
    create: { productId, optionTypeId: optionType.id },
    update: {},
  });

  return ok(optionType);
}

export async function addOptionValue(optionTypeId: string, value: string) {
  if (!value.trim()) return err({ code: ErrorCode.GENERAL_ERROR, message: "Value is required", status: 400 });

  const optionType = await prisma.optionType.findUnique({
    where: { id: optionTypeId },
    select: { shopId: true },
  });
  if (!optionType) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(optionType.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const optionValue = await prisma.optionValue.upsert({
    where: { optionTypeId_value: { optionTypeId, value: value.trim() } },
    create: { optionTypeId, value: value.trim() },
    update: {},
  });

  return ok(optionValue);
}

export async function removeOptionTypeFromProduct(productId: string, optionTypeId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { shopId: true } });
  if (!product) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(product.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.productOptionType.delete({
    where: { productId_optionTypeId: { productId, optionTypeId } },
  });
  return ok(null);
}

export async function removeOptionValue(optionValueId: string) {
  const optionValue = await prisma.optionValue.findUnique({
    where: { id: optionValueId },
    select: { optionType: { select: { shopId: true } } },
  });
  if (!optionValue) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(optionValue.optionType.shopId); }
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
