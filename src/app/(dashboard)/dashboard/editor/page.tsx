import { notFound } from "next/navigation";
import {
  getShopSections,
  getCategoriesByShop,
  getFirstCategorySlug,
  getFirstProductSlug,
  getShopOptionTypeNames,
  resolveCollectionConfig,
} from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import SectionEditor from "@/components/dashboard/editor/SectionEditor";
import prisma from "@/lib/db/prisma";

export default async function EditorPage() {
  const shop = await getShop();

  const [
    homeSectionsResult,
    collectionSectionsResult,
    productSectionsResult,
    searchSectionsResult,
    categoriesResult,
    firstCategorySlug,
    firstProductSlug,
    optionTypeNames,
    pages,
    products,
  ] = await Promise.all([
    getShopSections(shop.id, "home"),
    getShopSections(shop.id, "collection"),
    getShopSections(shop.id, "product"),
    getShopSections(shop.id, "search"),
    getCategoriesByShop(shop.id),
    getFirstCategorySlug(shop.id),
    getFirstProductSlug(shop.id),
    getShopOptionTypeNames(shop.id),
    prisma.page.findMany({ where: { shopId: shop.id }, select: { slug: true, title: true } }),
    prisma.product.findMany({ where: { shopId: shop.id, isActive: true }, select: { name: true, slug: true }, orderBy: { name: "asc" }, take: 50 }),
  ]);

  if (!homeSectionsResult.ok) notFound();

  return (
    <SectionEditor
      initialPagesSections={{
        home: homeSectionsResult.data,
        collection: collectionSectionsResult.ok ? collectionSectionsResult.data : [],
        product: productSectionsResult.ok ? productSectionsResult.data : [],
        search: searchSectionsResult.ok ? searchSectionsResult.data : [],
      }}
      shopId={shop.id}
      shopSlug={shop.slug}
      shopName={shop.name}
      currency={shop.currency}
      categories={categoriesResult.ok ? categoriesResult.data : []}
      pages={pages}
      products={products}
      themeId={(shop as { themeId?: string }).themeId ?? "minimal"}
      initialTheme={{
        primaryColor: shop.primaryColor,
        secondaryColor: shop.secondaryColor,
        pageBackground: shop.pageBackground,
        fontFamily: shop.fontFamily,
        borderRadius: shop.borderRadius,
      }}
      firstCategorySlug={firstCategorySlug}
      firstProductSlug={firstProductSlug}
      initialCollectionConfig={resolveCollectionConfig(
        (shop as { collectionConfig?: unknown }).collectionConfig ?? {},
      )}
      optionTypeNames={optionTypeNames}
    />
  );
}
