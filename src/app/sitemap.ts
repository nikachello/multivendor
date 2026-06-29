import { MetadataRoute } from "next";
import { getAllShops } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getAllShops();
  const entries: MetadataRoute.Sitemap = [];

  for (const shop of shops) {
    entries.push({
      url: `/shop/${shop.slug}`,
      lastModified: shop.updatedAt,
      changeFrequency: "weekly",
      priority: 1,
    });

    for (const product of shop.products) {
      entries.push({
        url: `/shop/${shop.slug}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const category of shop.categories) {
      entries.push({
        url: `/shop/${shop.slug}/collections/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
