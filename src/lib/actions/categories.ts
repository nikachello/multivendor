"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";
import { assertOwnsShop } from "../auth/assert-owns-shop";
import { categorySchema } from "../validators/category";

export async function createCategory(
  shopId: string,
  name: string,
  slug: string,
  description: string,
  isActive: boolean,
  image?: string,
) {
  if (!shopId)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required fields", status: 400 });
  const parsed = categorySchema.safeParse({ name, slug, description, isActive, image });
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid category data", status: 400 });

  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const category = await prisma.category.create({
    data: { shopId, name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description || null, isActive: parsed.data.isActive, image: parsed.data.image || null },
  });

  return ok(category);
}

export async function updateCategory(
  id: string,
  name: string,
  slug: string,
  description: string,
  isActive: boolean,
  image?: string,
) {
  if (!id)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required fields", status: 400 });
  const parsed = categorySchema.safeParse({ name, slug, description, isActive, image });
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid category data", status: 400 });

  const existing = await prisma.category.findUnique({ where: { id }, select: { shopId: true } });
  if (!existing) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(existing.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const category = await prisma.category.update({
    where: { id },
    data: { name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description || null, isActive: parsed.data.isActive, image: parsed.data.image ?? null },
  });

  return ok(category);
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id }, select: { shopId: true } });
  if (!existing) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(existing.shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.category.delete({ where: { id } });
  return ok(null);
}
