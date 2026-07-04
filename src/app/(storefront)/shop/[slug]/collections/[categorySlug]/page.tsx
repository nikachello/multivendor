import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getCategoryBySlug,
  getCollectionData,
  getShopSections,
  resolveCollectionConfig,
  CollectionSortOption,
} from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { getThemeConfig } from "@/themes";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { ShopSection } from "@/lib/types/store-section";
import Section from "@/components/storefront/layout/Section";
import EditorBridge from "@/components/storefront/EditorBridge";
import { getShopBase } from "@/lib/shop-base";

const KNOWN_PARAMS = new Set(["sort", "page", "minPrice", "maxPrice", "inStock"]);
const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { slug, categorySlug } = await params;
  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) return { title: "Not Found" };
  const categoryResult = await getCategoryBySlug(shopResult.data.id, categorySlug);
  if (!categoryResult.ok) return { title: "Not Found" };
  const category = categoryResult.data;
  const shop = shopResult.data;
  return {
    title: `${category.name} — ${shop.name}`,
    description: category.description ?? undefined,
    openGraph: {
      title: `${category.name} — ${shop.name}`,
      description: category.description ?? undefined,
      url: `/shop/${slug}/collections/${categorySlug}`,
      siteName: shop.name,
      type: "website",
      ...(category.image && { images: [{ url: category.image, alt: category.name }] }),
    },
    twitter: {
      card: category.image ? "summary_large_image" : "summary",
      title: `${category.name} — ${shop.name}`,
      description: category.description ?? undefined,
      ...(category.image && { images: [category.image] }),
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug, categorySlug } = await params;
  const sp = await searchParams;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const categoryResult = await getCategoryBySlug(shop.id, categorySlug);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;

  // Resolve seller's filter config — enforced both server-side and in the UI
  const collectionConfig = resolveCollectionConfig(
    (shop as { collectionConfig?: unknown }).collectionConfig ?? {},
  );

  // Parse search params — only apply params that the config allows
  function str(v: string | string[] | undefined): string | undefined {
    if (!v) return undefined;
    return Array.isArray(v) ? v[0] : v;
  }

  const sort = collectionConfig.showSort
    ? ((str(sp.sort) ?? "newest") as CollectionSortOption)
    : "newest";
  const page = Math.max(1, Number(str(sp.page) ?? "1") || 1);
  const minPrice =
    collectionConfig.showPrice && str(sp.minPrice)
      ? Number(str(sp.minPrice))
      : undefined;
  const maxPrice =
    collectionConfig.showPrice && str(sp.maxPrice)
      ? Number(str(sp.maxPrice))
      : undefined;
  const inStockOnly = collectionConfig.showInStock && str(sp.inStock) === "true";

  const optionFilters: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(sp)) {
    if (KNOWN_PARAMS.has(key) || !value) continue;
    // Skip option types the seller has hidden
    if (
      collectionConfig.visibleOptionTypes !== null &&
      !collectionConfig.visibleOptionTypes.includes(key)
    )
      continue;
    const raw = Array.isArray(value) ? value.join(",") : value;
    const values = raw.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length) optionFilters[key] = values;
  }

  // Build currentParamsStr for passing to client components
  const normalizedParams = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (!value) continue;
    normalizedParams.set(key, Array.isArray(value) ? value.join(",") : value);
  }
  const currentParamsStr = normalizedParams.toString();

  const [collectionResult, homeSectionsResult, pageSectionsResult, shopBase] =
    await Promise.all([
      getCollectionData(shop.id, category.id, {
        sort,
        page,
        pageSize: PAGE_SIZE,
        minPrice,
        maxPrice,
        optionFilters,
        inStockOnly,
      }),
      getShopSections(shop.id, "home"),
      getShopSections(shop.id, "collection"),
      getShopBase(slug),
    ]);

  const collectionData = collectionResult.ok ? collectionResult.data : null;
  const products = collectionData?.products ?? [];
  const total = collectionData?.total ?? 0;
  const allTotal = collectionData?.allTotal ?? 0;
  const facets = collectionData?.facets ?? {
    priceRange: { min: 0, max: 0 },
    options: [],
    hasTrackedInventory: false,
  };

  const homeSections = homeSectionsResult.ok ? homeSectionsResult.data : [];
  const pageSections = pageSectionsResult.ok ? pageSectionsResult.data : [];

  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const registry = getThemeRegistry(themeId);
  const themeConfig = getThemeConfig(themeId);

  const navbarSection = homeSections.find((s) => s.type === "navbar");
  const NavbarComponent = registry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopName?: string; shopSlug?: string }
  >;

  const noContainerTypes = new Set([
    "banner", "announcement", "navbar", "testimonials", "collection", "newsletter", "divider",
  ]);

  return (
    <>
      {navbarSection && NavbarComponent && (
        <NavbarComponent
          {...(navbarSection.props as NavbarSectionProps)}
          items={resolveNavItems(
            (navbarSection.props as NavbarSectionProps).items ?? [],
            shopBase,
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopBase={shopBase}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <div className="pb-20">
        <nav className="flex items-center gap-2 text-xs text-neutral-400 px-5 md:px-10 pt-8">
          <a
            href={shopBase || "/"}
            className="hover:text-neutral-600 transition-colors"
          >
            {shop.name}
          </a>
          <span>/</span>
          <span className="text-neutral-600">{category.name}</span>
        </nav>

        <CollectionContainer
          category={category}
          products={products}
          currency={shop.currency}
          shopSlug={shop.slug}
          shopBase={shopBase}
          total={total}
          allTotal={allTotal}
          page={page}
          facets={facets}
          sort={sort}
          minPrice={minPrice}
          maxPrice={maxPrice}
          optionFilters={optionFilters}
          inStockOnly={inStockOnly}
          currentParamsStr={currentParamsStr}
          config={collectionConfig}
        />

        <EditorBridge />

        {pageSections.map((section) => {
          const Component = registry[section.type] as React.ComponentType<
            ShopSection["props"]
          >;
          if (!Component) return null;
          const extraProps = {
            shopId: shop.id,
            shopSlug: shop.slug,
            shopBase,
            shopName: shop.name,
            currency: shop.currency,
            themeConfig,
          };
          return (
            <div key={section.id} data-section-id={section.id}>
              <Section container={!noContainerTypes.has(section.type)}>
                <Component {...section.props} {...extraProps} />
              </Section>
            </div>
          );
        })}
      </div>
    </>
  );
}
