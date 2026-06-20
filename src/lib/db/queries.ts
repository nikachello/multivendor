import { err, ok, Result } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { ShopSection } from "@/lib/types/store-section";
import prisma from "./prisma";
import { Category, Shop, Prisma, Testimonial } from "@/generated/prisma/client";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  categories: true,
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

type RawProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export type ProductWithRelations = Omit<
  RawProduct,
  "priceFrom" | "variants"
> & {
  priceFrom: number;
  variants: (Omit<RawProduct["variants"][number], "price"> & {
    price: number;
  })[];
};

function serializeProduct(p: RawProduct): ProductWithRelations {
  return {
    ...p,
    priceFrom: Number(p.priceFrom),
    variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
  };
}

// ============================================
// SHOP
// ============================================

export async function getShopBySlug(slug: string): Promise<Result<Shop>> {
  if (!slug) {
    return err({
      code: ErrorCode.SHOP_SLUG_MISSING,
      message: "áƒ¡áƒáƒ­áƒ˜áƒ áƒáƒ áƒ›áƒáƒ¦áƒáƒ–áƒ˜áƒ˜áƒ¡ slug",
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
      code: ErrorCode.SHOP_NOT_FOUND,
      message: "áƒ›áƒáƒ¦áƒáƒ–áƒ˜áƒ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(shop);
}

export async function getShopByOwnerId(ownerId: string) {
  if (!ownerId)
    return err({
      code: "SOME_PROPERTIS_ARE_MISSING",
      message: "Owner ID is required",
      status: 400,
    });

  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: ownerId,
    },
  });

  if (!shop) {
    return err({
      code: ErrorCode.SHOP_NOT_FOUND,
      message: "Shop not found",
      status: 404,
    });
  }

  return ok(shop);
}

export async function getAllShops() {
  return prisma.shop.findMany({
    select: {
      slug: true,
      updatedAt: true,
      products: { select: { slug: true, updatedAt: true } },
      categories: { select: { slug: true, updatedAt: true } },
    },
  });
}

// ============================================
// SHOP SECTIONS
// ============================================

export async function getShopSections(
  shopId: string,
  pageType: string = "home",
): Promise<Result<ShopSection[]>> {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message:
        "áƒ¡áƒáƒ­áƒ˜áƒ áƒáƒ áƒ›áƒáƒ¦áƒáƒ–áƒ˜áƒ˜áƒ¡ áƒ˜áƒ“áƒ”áƒœáƒ¢áƒ˜áƒ¤áƒ˜áƒ™áƒáƒ¢áƒáƒ áƒ˜",
      status: 400,
    });
  }

  const rows = await prisma.shopSection.findMany({
    where: { shopId, pageType },
    orderBy: { order: "asc" },
  });

  const sections = rows.map((row) => ({
    id: row.id,
    type: row.type,
    props: row.props,
  })) as ShopSection[];

  return ok(sections);
}

export async function getFirstCategorySlug(shopId: string): Promise<string | null> {
  const category = await prisma.category.findFirst({
    where: { shopId },
    select: { slug: true },
    orderBy: { createdAt: "asc" },
  });
  return category?.slug ?? null;
}

export async function getFirstProductSlug(shopId: string): Promise<string | null> {
  const product = await prisma.product.findFirst({
    where: { shopId },
    select: { slug: true },
    orderBy: { createdAt: "asc" },
  });
  return product?.slug ?? null;
}

// ============================================// CATEGORIES
// ============================================

export async function getCategoriesByShop(
  shopId: string,
): Promise<Result<Category[]>> {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message:
        "áƒ¡áƒáƒ­áƒ˜áƒ áƒáƒ áƒ›áƒáƒ¦áƒáƒ–áƒ˜áƒ˜áƒ¡ áƒ˜áƒ“áƒ”áƒœáƒ¢áƒ˜áƒ¤áƒ˜áƒ™áƒáƒ¢áƒáƒ áƒ˜",
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
      code: ErrorCode.CATEGORY_NOT_FOUND,
      message: "áƒ™áƒáƒ¢áƒ”áƒ’áƒáƒ áƒ˜áƒ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(category);
}

// ============================================
// CATEGORY BY ID (dashboard)
// ============================================

export async function getCategoryById(id: string): Promise<Result<Category>> {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category)
    return err({
      code: ErrorCode.CATEGORY_NOT_FOUND,
      message: "Category not found",
      status: 404,
    });
  return ok(category);
}

// ============================================
// PRODUCT BY ID (dashboard)
// ============================================

export async function getProductById(
  id: string,
): Promise<Result<ProductWithRelations>> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    return err({
      code: ErrorCode.PRODUCT_NOT_FOUND,
      message: "Product not found",
      status: 404,
    });
  }

  return ok(serializeProduct(product));
}

// ============================================
// PRODUCT WITH OPTIONS (dashboard edit page)
// ============================================

export type ProductOptionType = {
  optionTypeId: string;
  name: string;
  values: { id: string; value: string }[];
};

export async function getProductWithOptions(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ...productInclude,
      optionTypes: {
        include: {
          optionType: {
            include: { values: true },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!product) return null;

  return {
    ...serializeProduct(product),
    optionTypes: product.optionTypes.map((pot) => ({
      optionTypeId: pot.optionType.id,
      name: pot.optionType.name,
      values: pot.optionType.values.map((v) => ({ id: v.id, value: v.value })),
    })) as ProductOptionType[],
  };
}

// ============================================
// PRODUCT BY SLUG (storefront)
// ============================================

export async function getProductBySlug(
  shopId: string,
  productSlug: string,
): Promise<Result<ProductWithRelations>> {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message:
        "áƒ¡áƒáƒ­áƒ˜áƒ áƒáƒ áƒ›áƒáƒ¦áƒáƒ–áƒ˜áƒ˜áƒ¡ áƒ˜áƒ“áƒ”áƒœáƒ¢áƒ˜áƒ¤áƒ˜áƒ™áƒáƒ¢áƒáƒ áƒ˜",
      status: 400,
    });
  }

  if (!productSlug) {
    return err({
      code: ErrorCode.PRODUCT_SLUG_MISSING,
      message:
        "áƒ¡áƒáƒ­áƒ˜áƒ áƒáƒ áƒžáƒ áƒáƒ“áƒ£áƒ¥áƒ¢áƒ˜áƒ¡ áƒ˜áƒ“áƒ”áƒœáƒ¢áƒ˜áƒ¤áƒ˜áƒ™áƒáƒ¢áƒáƒ áƒ˜",
      status: 400,
    });
  }

  const product = await prisma.product.findFirst({
    where: { slug: productSlug, shopId, isActive: true },
    include: productInclude,
  });

  if (!product) {
    return err({
      code: ErrorCode.PRODUCT_NOT_FOUND,
      message: "áƒžáƒ áƒáƒ“áƒ£áƒ¥áƒ¢áƒ˜ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(serializeProduct(product));
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
      code: ErrorCode.SHOP_ID_MISSING,
      message: "Shop id is required",
      status: 400,
    });
  }

  if (!categoryId) {
    return err({
      code: ErrorCode.CATEGORY_ID_MISSING,
      message: "Category id is required",
      status: 400,
    });
  }

  const products = await prisma.product.findMany({
    where: { shopId, categories: { some: { id: categoryId } }, isActive: true },
    include: productInclude,
  });

  if (!products) {
    return err({
      code: ErrorCode.PRODUCTS_NOT_FOUND,
      message: "áƒžáƒ áƒáƒ“áƒ£áƒ¥áƒ¢áƒ”áƒ‘áƒ˜ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(products.map(serializeProduct));
}

// ============================================
// ALL PRODUCTS
// ============================================

export async function getProductsByShop(
  shopId: string,
): Promise<Result<ProductWithRelations[]>> {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
      message: "Shop id is required",
      status: 400,
    });
  }

  const products = await prisma.product.findMany({
    where: { shopId, isActive: true },
    include: productInclude,
  });

  if (!products) {
    return err({
      code: ErrorCode.PRODUCTS_NOT_FOUND,
      message: "áƒžáƒ áƒáƒ“áƒ£áƒ¥áƒ¢áƒ”áƒ‘áƒ˜ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(products.map(serializeProduct));
}

// ============================================
// TESTIMONIAL
// ============================================

export async function getTestimonialsByShop(
  shopId: string,
): Promise<Result<Testimonial[]>> {
  if (!shopId) {
    return err({
      code: ErrorCode.SHOP_ID_MISSING,
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
      code: ErrorCode.TESTIMONIALS_NOT_FOUND,
      message: "áƒ¨áƒ”áƒ¤áƒáƒ¡áƒ”áƒ‘áƒ áƒáƒ  áƒ›áƒáƒ˜áƒ«áƒ”áƒ‘áƒœáƒ",
      status: 404,
    });
  }

  return ok(testimonials);
}

export async function getOrderById(id: string) {
  if (!id) return err({ code: ErrorCode.ORDER_NOT_FOUND, message: "Order ID is required", status: 400 });

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return err({ code: ErrorCode.ORDER_NOT_FOUND, message: "Order not found", status: 404 });

  return ok(order);
}

export async function getDashboardStats(shopId: string) {
  const [productCount, categoryCount, orderCount, revenueAgg, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { shopId } }),
      prisma.category.count({ where: { shopId } }),
      prisma.order.count({ where: { shopId } }),
      prisma.order.aggregate({ where: { shopId }, _sum: { total: true } }),
      prisma.order.findMany({
        where: { shopId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
    ]);

  return {
    productCount,
    categoryCount,
    orderCount,
    revenue: Number(revenueAgg._sum.total ?? 0),
    recentOrders,
  };
}

export async function searchProducts(
  shopId: string,
  query: string,
): Promise<Result<ProductWithRelations[]>> {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID required", status: 400 });

  const products = await prisma.product.findMany({
    where: {
      shopId,
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: productInclude,
  });

  return ok(products.map(serializeProduct));
}

export async function getOrdersByShop(shopId: string) {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID is required", status: 400 });

  const orders = await prisma.order.findMany({
    where: { shopId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return ok(orders);
}

export type CategoryWithCount = Category & { _count: { products: number } };

export async function getCategoriesWithCount(shopId: string): Promise<Result<CategoryWithCount[]>> {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID is required", status: 400 });

  const data = await prisma.category.findMany({
    where: { shopId },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return ok(data);
}
