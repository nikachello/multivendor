"use server";

import prisma from "../db/prisma";
import { ErrorCode } from "../errors";
import { err, ok } from "../result";
import { assertOwnsShop } from "../auth/assert-owns-shop";
import { isProShop, FREE_PRODUCT_LIMIT } from "../subscription";
import { productSchema } from "../validators/product";

async function shopIdForProduct(productId: string) {
  const p = await prisma.product.findUnique({ where: { id: productId }, select: { shopId: true } });
  return p?.shopId ?? null;
}

async function shopIdForImage(imageId: string) {
  const img = await prisma.productImage.findUnique({
    where: { id: imageId },
    select: { product: { select: { shopId: true } } },
  });
  return img?.product.shopId ?? null;
}

export async function addProductImages(productId: string, urls: string[]) {
  const shopId = await shopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const agg = await prisma.productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });
  const start = (agg._max.sortOrder ?? -1) + 1;

  const images = await Promise.all(
    urls.map((url, i) => prisma.productImage.create({
      data: { productId, url, sortOrder: start + i },
    })),
  );
  return ok(images);
}

export async function deleteProductImage(imageId: string) {
  const shopId = await shopIdForImage(imageId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.productImage.delete({ where: { id: imageId } });
  return ok(null);
}

export async function reorderProductImages(productId: string, orderedIds: string[]) {
  const shopId = await shopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.productImage.update({ where: { id }, data: { sortOrder: i } }),
    ),
  );
  return ok(null);
}

export async function setMainProductImage(imageId: string, productId: string) {
  const shopId = await shopIdForProduct(productId);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  await prisma.$transaction([
    prisma.productImage.updateMany({ where: { productId }, data: { isMain: false } }),
    prisma.productImage.update({ where: { id: imageId }, data: { isMain: true } }),
  ]);
  return ok(null);
}

export const createProduct = async (
  shopId: string,
  name: string,
  slug: string,
  description: string,
  price: number,
  categoryIds: string[],
) => {
  if (!shopId)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Some parameters are missing",
      status: 400,
    });
  const parsed = productSchema.safeParse({ name, slug, description, price, categoryIds });
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid product data", status: 400 });

  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const shopData = await prisma.shop.findUnique({ where: { id: shopId }, select: { subscriptionPaidUntil: true } });
  if (!isProShop(shopData?.subscriptionPaidUntil)) {
    const count = await prisma.product.count({ where: { shopId } });
    if (count >= FREE_PRODUCT_LIMIT) {
      return err({
        code: ErrorCode.PLAN_LIMIT_REACHED,
        message: String(FREE_PRODUCT_LIMIT),
        status: 403,
      });
    }
  }

  const product = await prisma.product.create({
    data: {
      shopId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      priceFrom: parsed.data.price,
      categories: parsed.data.categoryIds.length ? { connect: parsed.data.categoryIds.map((id) => ({ id })) } : undefined,
    },
  });

  return ok(product);
};

export const updateProduct = async (
  id: string,
  name: string,
  slug: string,
  description: string,
  price: number,
  categoryIds: string[],
) => {
  if (!id)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Some parameters are missing",
      status: 400,
    });
  const parsed = productSchema.safeParse({ name, slug, description, price, categoryIds });
  if (!parsed.success)
    return err({ code: ErrorCode.GENERAL_ERROR, message: parsed.error.issues[0]?.message ?? "Invalid product data", status: 400 });

  const shopId = await shopIdForProduct(id);
  if (!shopId) return err({ code: ErrorCode.GENERAL_ERROR, message: "Not found", status: 404 });
  try { await assertOwnsShop(shopId); }
  catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      priceFrom: parsed.data.price,
      categories: { set: parsed.data.categoryIds.map((id) => ({ id })) },
    },
  });

  return ok(product);
};
