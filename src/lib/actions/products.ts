"use server";

import prisma from "../db/prisma";
import { ErrorCode } from "../errors";
import { err, ok } from "../result";

export async function addProductImages(productId: string, urls: string[]) {
  await prisma.productImage.createMany({
    data: urls.map((url, i) => ({ productId, url, sortOrder: i })),
  });
  return ok(null);
}

export async function deleteProductImage(imageId: string) {
  await prisma.productImage.delete({ where: { id: imageId } });
  return ok(null);
}

export const createProduct = async (
  shopId: string,
  name: string,
  slug: string,
  description: string,
  price: number,
  categoryId: string,
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
      categoryId: categoryId || null,
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
  categoryId: string,
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
      categoryId: categoryId || null,
    },
  });

  return ok(product);
};
