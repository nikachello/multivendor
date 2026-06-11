import { err, ok, Result } from "@/lib/result";
import { ShopSection } from "@/lib/types/store-section";
import prisma from "./prisma";
import { Category, Shop, Prisma, Testimonial } from "@/generated/prisma/client";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  variants: {
    include: {
      optionValues: {
        include: {
          optionValue: {
            include: { optionType: true },
          },
        },
      },
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

// ============================================
// SHOP
// ============================================

export async function getShopBySlug(slug: string): Promise<Result<Shop>> {
  if (!slug) {
    return err({
      code: "SHOP_SLUG_MISSING",
      message: "საჭიროა მაღაზიის slug",
      status: 400,
    });
  }

  const shop = await prisma.shop.findUnique({
    where: {
      slug,
      isActive: true,
    },
  });

  if (!shop) {
    return err({
      code: "SHOP_NOT_FOUND",
      message: "მაღაზია არ მოიძებნა",
      status: 404,
    });
  }

  return ok(shop);
}

// ============================================
// SHOP SECTIONS
// ============================================

export async function getShopSections(
  shopId: string,
): Promise<Result<ShopSection[]>> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "საჭიროა მაღაზიის იდენტიფიკატორი",
      status: 400,
    });
  }

  const rows = await prisma.shopSection.findMany({
    where: { shopId },
    orderBy: { order: "asc" },
  });

  const sections = rows.map((row) => ({
    id: row.id,
    type: row.type,
    props: row.props,
  })) as ShopSection[];

  return ok(sections);
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategoriesByShop(
  shopId: string,
): Promise<Result<Category[]>> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "საჭიროა მაღაზიის იდენტიფიკატორი",
      status: 400,
    });
  }

  const data = await prisma.category.findMany({
    where: {
      shopId,
      isActive: true,
    },
  });

  return ok(data);
}

// ============================================
// CATEGORY BY SLUG
// ============================================

export async function getCategoryBySlug(
  shopId: string,
  slug: string,
): Promise<Result<Category>> {
  const category = await prisma.category.findFirst({
    where: {
      shopId,
      slug,
      isActive: true,
    },
  });

  if (!category) {
    return err({
      code: "CATEGORY_NOT_FOUND",
      message: "კატეგორია არ მოიძებნა",
      status: 404,
    });
  }

  return ok(category);
}

// ============================================
// PRODUCT BY ID
// ============================================

export async function getProductBySlug(
  shopId: string,
  productSlug: string,
): Promise<Result<ProductWithRelations>> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "საჭიროა მაღაზიის იდენტიფიკატორი",
      status: 400,
    });
  }

  if (!productSlug) {
    return err({
      code: "PRODUCT_SLUG_MISSING",
      message: "საჭიროა პროდუქტის იდენტიფიკატორი",
      status: 400,
    });
  }

  const product = await prisma.product.findFirst({
    where: { slug: productSlug, shopId, isActive: true },
    include: productInclude,
  });

  if (!product) {
    return err({
      code: "PRODUCT_NOT_FOUND",
      message: "პროდუქტი არ მოიძებნა",
      status: 404,
    });
  }

  return ok(product);
}

// ============================================
// PRODUCTS BY CATEGORY
// ============================================

export async function getProductsByCategory(
  shopId: string,
  categoryId: string,
): Promise<Result<ProductWithRelations[]>> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "Shop id is required",
      status: 400,
    });
  }

  if (!categoryId) {
    return err({
      code: "CATEGORY_ID_MISSING",
      message: "Category id is required",
      status: 400,
    });
  }

  const products = await prisma.product.findMany({
    where: { shopId, categoryId, isActive: true },
    include: productInclude,
  });

  if (!products) {
    return err({
      code: "PRODUCTS_NOT_FOUND",
      message: "პროდუქტები არ მოიძებნა",
      status: 404,
    });
  }

  return ok(products);
}

// ============================================
// TESTIMONIAL
// ============================================

export async function getTestimonialsByShop(
  shopId: string,
): Promise<Result<Testimonial[]>> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "Shop id is required",
      status: 400,
    });
  }

  const testimonials = await prisma.testimonial.findMany({
    where: {
      shopId,
    },
  });

  if (!testimonials) {
    return err({
      code: "TESTIMONIALS_NOT_FOUND",
      message: "შეფასება არ მოიძებნა",
      status: 404,
    });
  }

  return ok(testimonials);
}
