"use server";

import prisma from "../db/prisma";
import { ok, err } from "../result";
import { ErrorCode } from "../errors";

export async function createCategory(
  shopId: string,
  name: string,
  slug: string,
  description: string,
  isActive: boolean,
  image?: string,
) {
  if (!shopId || !name || !slug)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required fields", status: 400 });

  const category = await prisma.category.create({
    data: { shopId, name, slug, description: description || null, isActive, image: image || null },
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
  if (!id || !name || !slug)
    return err({ code: ErrorCode.GENERAL_ERROR, message: "Missing required fields", status: 400 });

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug, description: description || null, isActive, image: image ?? null },
  });

  return ok(category);
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  return ok(null);
}
