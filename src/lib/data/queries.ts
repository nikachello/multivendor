import { shops, categories, products } from "@/lib/mock-data";
import { shopSections } from "./shop-config";

// Thin wrapper functions — they look like DB calls because they will be.
// Your page imports these, never the raw mock arrays directly.

export function getShopBySlug(slug: string) {
  return shops.find((s) => s.slug === slug && s.isActive) ?? null;
}

export function getShopSections(shopId: string) {
  return shopSections[shopId] ?? [];
}

export function getCategoriesByShop(shopId: string) {
  return categories.filter((c) => c.shopId === shopId && c.isActive);
}

export function getProductsByCategory(shopId: string, categoryId: string) {
  return products.filter(
    (p) => p.shopId === shopId && p.categoryId === categoryId && p.isActive
  );
}
