import { cache } from "react";
import { err, ok, Result } from "@/lib/result";
import { ErrorCode } from "@/lib/errors";
import { ShopSection } from "@/lib/types/store-section";
import prisma from "./prisma";
import { Category, Shop, Prisma, Testimonial, OrderStatus } from "@/generated/prisma/client";

// ============================================
// COLLECTION CONFIG
// ============================================

export type CollectionConfig = {
  showSort?: boolean;
  showPrice?: boolean;
  showInStock?: boolean;
  visibleOptionTypes?: string[] | null; // null/missing = all
};

export const DEFAULT_COLLECTION_CONFIG: Required<CollectionConfig> = {
  showSort: true,
  showPrice: true,
  showInStock: true,
  visibleOptionTypes: null,
};

export function resolveCollectionConfig(raw: Prisma.JsonValue): Required<CollectionConfig> {
  const cfg =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Partial<CollectionConfig>)
      : {};
  return { ...DEFAULT_COLLECTION_CONFIG, ...cfg };
}

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

export const getShopBySlug = cache(async (slug: string): Promise<Result<Shop>> => {
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
});

export async function getShopByOwnerId(ownerId: string) {
  if (!ownerId)
    return err({
      code: "SOME_PROPERTIS_ARE_MISSING",
      message: "Owner ID is required",
      status: 400,
    });

  const shop = await prisma.shop.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
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
    where: { isActive: true },
    select: {
      slug: true,
      customDomain: true,
      domainVerified: true,
      updatedAt: true,
      products: { where: { isActive: true }, select: { slug: true, updatedAt: true } },
      categories: { where: { isActive: true }, select: { slug: true, updatedAt: true } },
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
// FEATURED PRODUCTS (homepage sections — bounded fetch)
// ============================================

export async function getFeaturedProducts(
  shopId: string,
  categoryId: string,
  take: number,
): Promise<Result<ProductWithRelations[]>> {
  if (!shopId || !categoryId) {
    return err({
      code: ErrorCode.CATEGORY_ID_MISSING,
      message: "Shop id and category id are required",
      status: 400,
    });
  }

  const products = await prisma.product.findMany({
    where: { shopId, categories: { some: { id: categoryId } }, isActive: true },
    include: productInclude,
    take,
    orderBy: { createdAt: "desc" },
  });

  return ok(products.map(serializeProduct));
}

// ============================================
// SHOP OPTION TYPE NAMES (for collection config UI)
// ============================================

export async function getShopOptionTypeNames(shopId: string): Promise<string[]> {
  const types = await prisma.optionType.findMany({
    where: { shopId },
    select: { name: true },
    orderBy: { name: "asc" },
  });
  return types.map((t) => t.name);
}

// ============================================
// COLLECTION DATA (storefront — with filters, sort, pagination, facets)
// ============================================

export type CollectionSortOption = "newest" | "price_asc" | "price_desc" | "name_asc";

export type CollectionFilters = {
  sort?: CollectionSortOption;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  optionFilters?: Record<string, string[]>;
  inStockOnly?: boolean;
};

export type CollectionFacets = {
  priceRange: { min: number; max: number };
  options: Array<{ name: string; values: string[] }>;
  hasTrackedInventory: boolean;
};

export type CollectionData = {
  products: ProductWithRelations[];
  total: number;
  allTotal: number;
  facets: CollectionFacets;
};

export async function getCollectionData(
  shopId: string,
  categoryId: string,
  filters: CollectionFilters = {},
): Promise<Result<CollectionData>> {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop id is required", status: 400 });
  if (!categoryId) return err({ code: ErrorCode.CATEGORY_ID_MISSING, message: "Category id is required", status: 400 });

  const raw = await prisma.product.findMany({
    where: { shopId, categories: { some: { id: categoryId } }, isActive: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  const all = raw.map(serializeProduct);

  // Build facets from all products (static — not narrowed by active filters)
  const prices = all.map((p) => p.priceFrom);
  const optionMap = new Map<string, Set<string>>();
  let hasTrackedInventory = false;

  for (const product of all) {
    for (const variant of product.variants) {
      if (variant.trackInventory) hasTrackedInventory = true;
      for (const ov of variant.optionValues) {
        const typeName = ov.optionValue.optionType.name;
        if (!optionMap.has(typeName)) optionMap.set(typeName, new Set());
        optionMap.get(typeName)!.add(ov.optionValue.value);
      }
    }
  }

  const facets: CollectionFacets = {
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    options: Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values).sort(),
    })),
    hasTrackedInventory,
  };

  const {
    sort = "newest",
    page = 1,
    pageSize = 24,
    minPrice,
    maxPrice,
    optionFilters = {},
    inStockOnly = false,
  } = filters;

  let filtered = all;

  if (minPrice !== undefined) filtered = filtered.filter((p) => p.priceFrom >= minPrice);
  if (maxPrice !== undefined) filtered = filtered.filter((p) => p.priceFrom <= maxPrice);

  if (inStockOnly) {
    filtered = filtered.filter((p) =>
      p.variants.some((v) => !v.trackInventory || v.stock > 0),
    );
  }

  // Within a type: OR — across types: AND
  for (const [typeName, values] of Object.entries(optionFilters)) {
    if (!values.length) continue;
    filtered = filtered.filter((p) =>
      p.variants.some((v) =>
        v.optionValues.some(
          (ov) =>
            ov.optionValue.optionType.name === typeName &&
            values.includes(ov.optionValue.value),
        ),
      ),
    );
  }

  if (sort === "price_asc") filtered = [...filtered].sort((a, b) => a.priceFrom - b.priceFrom);
  else if (sort === "price_desc") filtered = [...filtered].sort((a, b) => b.priceFrom - a.priceFrom);
  else if (sort === "name_asc") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const total = filtered.length;
  const products = filtered.slice((page - 1) * pageSize, page * pageSize);

  return ok({ products, total, allTotal: all.length, facets });
}

// ============================================
// ALL PRODUCTS
// ============================================

export async function getProductsByShop(
  shopId: string,
  opts: { q?: string; page?: number; pageSize?: number } = {},
): Promise<Result<{ data: ProductWithRelations[]; total: number }>> {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop id is required", status: 400 });
  const { q, page = 1, pageSize = 20 } = opts;
  const where: Prisma.ProductWhereInput = {
    shopId,
    isActive: true,
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ]} : {}),
  };
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return ok({ data: products.map(serializeProduct), total });
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
    where: { shopId },
    orderBy: { createdAt: "desc" },
  });

  return ok(testimonials);
}

export async function getProductTestimonials(
  shopId: string,
  productId: string,
) {
  return prisma.testimonial.findMany({
    where: { shopId, productId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
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

export async function getAnalyticsData(shopId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [events, orders] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { shopId, createdAt: { gte: since } },
      select: { type: true, sessionId: true, value: true, createdAt: true, productId: true },
    }),
    prisma.order.findMany({
      where: { shopId, createdAt: { gte: since }, status: { notIn: ["cancelled", "refunded"] } },
      select: { total: true, createdAt: true, items: { select: { productId: true, productName: true, price: true, quantity: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Funnel sets
  const sessions     = new Set(events.map((e) => e.sessionId));
  const atcSessions  = new Set(events.filter((e) => e.type === "add_to_cart").map((e) => e.sessionId));
  const coSessions   = new Set(events.filter((e) => e.type === "checkout").map((e) => e.sessionId));
  const purSessions  = new Set(events.filter((e) => e.type === "purchase").map((e) => e.sessionId));

  const sessionCount    = sessions.size;
  const atcRate         = sessionCount > 0 ? atcSessions.size / sessionCount : 0;
  const checkoutRate    = atcSessions.size > 0 ? coSessions.size / atcSessions.size : 0;
  const conversionRate  = sessionCount > 0 ? purSessions.size / sessionCount : 0;

  // Revenue metrics
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const orderCount = orders.length;
  const aov = orderCount > 0 ? revenue / orderCount : 0;

  // Daily revenue — fill missing days with 0
  const dailyMap = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of orders) {
    const day = new Date(o.createdAt).toISOString().slice(0, 10);
    if (dailyMap.has(day)) dailyMap.set(day, (dailyMap.get(day) ?? 0) + Number(o.total));
  }
  const dailyRevenue = Array.from(dailyMap.entries()).map(([date, value]) => ({ date, value }));

  // Top products by revenue
  const productMap = new Map<string, { name: string; revenue: number; orders: number }>();
  for (const o of orders) {
    for (const item of o.items) {
      const existing = productMap.get(item.productId) ?? { name: item.productName, revenue: 0, orders: 0 };
      existing.revenue += Number(item.price) * item.quantity;
      existing.orders += 1;
      productMap.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    sessionCount,
    atcRate,
    checkoutRate,
    conversionRate,
    revenue,
    orderCount,
    aov,
    dailyRevenue,
    topProducts,
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

export async function getOrdersByShop(
  shopId: string,
  opts: { q?: string; status?: string; page?: number; pageSize?: number } = {},
) {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID is required", status: 400 });
  const { q, status, page = 1, pageSize = 20 } = opts;
  const where: Prisma.OrderWhereInput = {
    shopId,
    ...(status ? { status: status as OrderStatus } : {}),
    ...(q ? { OR: [
      { id: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
    ]} : {}),
  };
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return ok({ data: orders, total });
}

export type CategoryWithCount = Category & { _count: { products: number } };

export async function getCategoriesWithCount(
  shopId: string,
  opts: { q?: string; page?: number; pageSize?: number } = {},
): Promise<Result<{ data: CategoryWithCount[]; total: number }>> {
  if (!shopId) return err({ code: ErrorCode.SHOP_ID_MISSING, message: "Shop ID is required", status: 400 });
  const { q, page = 1, pageSize = 20 } = opts;
  const where: Prisma.CategoryWhereInput = {
    shopId,
    ...(q ? { OR: [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ]} : {}),
  };
  const [total, data] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return ok({ data, total });
}
