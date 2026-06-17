"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";

// Adds an option type to a product.
// If the option type name already exists at shop level, reuses it.
// Otherwise creates it fresh.
export async function addOptionType(productId: string, shopId: string, name: string) {
  if (!name.trim()) return err({ code: ErrorCode.GENERAL_ERROR, message: "Name is required", status: 400 });

  // upsert: create if not exists, return existing if already there
  const optionType = await prisma.optionType.upsert({
    where: { shopId_name: { shopId, name: name.trim() } },
    create: { shopId, name: name.trim() },
    update: {},
  });

  // link it to this product (ignore if already linked)
  await prisma.productOptionType.upsert({
    where: { productId_optionTypeId: { productId, optionTypeId: optionType.id } },
    create: { productId, optionTypeId: optionType.id },
    update: {},
  });

  return ok(optionType);
}

// Adds a value to an option type (e.g. "M" under "Size")
export async function addOptionValue(optionTypeId: string, value: string) {
  if (!value.trim()) return err({ code: ErrorCode.GENERAL_ERROR, message: "Value is required", status: 400 });

  const optionValue = await prisma.optionValue.upsert({
    where: { optionTypeId_value: { optionTypeId, value: value.trim() } },
    create: { optionTypeId, value: value.trim() },
    update: {},
  });

  return ok(optionValue);
}

// Removes the link between a product and an option type
// Does NOT delete the option type itself (it's shop-level, other products may use it)
export async function removeOptionTypeFromProduct(productId: string, optionTypeId: string) {
  await prisma.productOptionType.delete({
    where: { productId_optionTypeId: { productId, optionTypeId } },
  });
  return ok(null);
}

// Removes a single option value and any variants that used it
export async function removeOptionValue(optionValueId: string) {
  // find variants that reference this value before cascading delete removes the links
  const affected = await prisma.variantOptionValue.findMany({
    where: { optionValueId },
    select: { variantId: true },
  });

  await prisma.optionValue.delete({ where: { id: optionValueId } });

  // delete those variants — their option value links are already gone via cascade
  if (affected.length > 0) {
    await prisma.variant.deleteMany({
      where: { id: { in: affected.map((v) => v.variantId) } },
    });
  }

  return ok(null);
}
