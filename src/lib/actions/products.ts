"use server";

import prisma from "../db/prisma";
import { ErrorCode } from "../errors";
import { err, ok } from "../result";

export async function addProductImages(productId: string, urls: string[]) {
  const agg = await prisma.productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });
  const start = (agg._max.sortOrder ?? -1) + 1;

  await prisma.productImage.createMany({
    data: urls.map((url, i) => ({ productId, url, sortOrder: start + i })),
  });
  return ok(null);
}

export async function deleteProductImage(imageId: string) {
  await prisma.productImage.delete({ where: { id: imageId } });
  return ok(null);
}

export async function reorderProductImages(productId: string, orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, i) =>
      prisma.productImage.update({ where: { id }, data: { sortOrder: i } }),
    ),
  );
  return ok(null);
}

export async function setMainProductImage(imageId: string, productId: string) {
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
  if (!shopId || !name || !slug || !description || !price)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Some parameters are missing",
      status: 400,
    });

  const product = await prisma.product.create({
    data: {
      shopId,
      name,
      slug,
      description,
      priceFrom: price,
      categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
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
  if (!id || !name || !slug || !price)
    return err({
      code: ErrorCode.GENERAL_ERROR,
      message: "Some parameters are missing",
      status: 400,
    });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      priceFrom: price,
      categories: { set: categoryIds.map((id) => ({ id })) },
    },
  });

  return ok(product);
};
