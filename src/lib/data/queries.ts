import { shops, categories, products } from "@/lib/mock-data";
import { shopSections } from "./shop-config";
import { err, ok, Result } from "../core/result";
import { Category, Product, Shop } from "../types/data-types";
import { ShopSection } from "../types/store-section";

// ============================================
// SHOP
// ============================================

export function getShopBySlug(slug: string): Result<Shop> {
  if (!slug) {
    return err({
      code: "SHOP_SLUG_MISSING",
      message: "Shop slug is required",
      status: 400,
    });
  }

  const shop = shops.find((s) => s.slug === slug && s.isActive);

  if (!shop) {
    return err({
      code: "SHOP_NOT_FOUND",
      message: "Shop not found",
      status: 404,
    });
  }

  return ok(shop);
}

// ============================================
// SHOP SECTIONS
// ============================================

export function getShopSections(shopId: string): Result<ShopSection[]> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "Shop id is required",
      status: 400,
    });
  }

  const sections = shopSections[shopId] ?? [];

  return ok(sections);
}

// ============================================
// CATEGORIES
// ============================================

export function getCategoriesByShop(shopId: string): Result<Category[]> {
  if (!shopId) {
    return err({
      code: "SHOP_ID_MISSING",
      message: "საჭიროა მაღაზიის იდენტიფიკატორი",
      status: 400,
    });
  }

  const data = categories.filter((c) => c.shopId === shopId && c.isActive);

  if (data.length === 0) {
    return err({
      code: "CATEGORIES_EMPTY",
      message: "კატეგორიები არ მოიძებნა",
      status: 404,
    });
  }

  return ok(data);
}

// ============================================
// PRODUCTS BY CATEGORY
// ============================================

export function getProductsByCategory(
  shopId: string,
  categoryId: string
): Result<Product[]> {
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

  const data = products.filter(
    (p) => p.shopId === shopId && p.categoryId === categoryId && p.isActive
  );

  if (data.length === 0) {
    return err({
      code: "PRODUCTS_EMPTY",
      message: "No products found for this category",
      status: 404,
    });
  }

  return ok(data);
}
