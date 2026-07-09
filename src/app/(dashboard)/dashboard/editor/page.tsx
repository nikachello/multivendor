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
