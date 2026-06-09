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

  return ok(data);
}

// ============================================
// CATEGORY BY SLUG
// ============================================

export function getCategoryBySlug(
  shopId: string,
  slug: string
): Result<Category> {
  const category = categories.find(
    (c) => c.shopId === shopId && c.slug === slug && c.isActive
  );

  if (!category) {
    return err({
      code: "CATEGORY_NOT_FOUND",
      message: "Category not found",
      status: 404,
    });
  }

  return ok(category);
}

// ============================================
// PRODUCT BY ID
// ============================================

export function getProductById(
  shopId: string,
  productId: string
): Result<Product> {
  const product = products.find(
    (p) => p.shopId === shopId && p.id === productId && p.isActive
  );

  if (!product) {
    return err({
      code: "PRODUCT_NOT_FOUND",
      message: "Product not found",
      status: 404,
    });
  }

  return ok(product);
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

  return ok(data);
}
