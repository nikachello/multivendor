import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getShopBySlug, searchProducts, getShopSections } from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { ShopSection } from "@/lib/types/store-section";
import Section from "@/components/storefront/layout/Section";
import CollectionItem from "@/components/storefront/collection/CollectionItem";
import SearchInput from "./SearchInput";
import EditorBridge from "@/components/storefront/EditorBridge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return { title: "Not Found" };
  return {
    title: `Search — ${result.data.name}`,
    robots: { index: false },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q = "" } = await searchParams;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const [homeSectionsResult, pageSectionsResult, productsResult] = await Promise.all([
    getShopSections(shop.id, "home"),
    getShopSections(shop.id, "search"),
    q.trim() ? searchProducts(shop.id, q.trim()) : Promise.resolve(null),
  ]);

  const homeSections = homeSectionsResult.ok ? homeSectionsResult.data : [];
  const pageSections = pageSectionsResult.ok ? pageSectionsResult.data : [];
  const products = productsResult?.ok ? productsResult.data : [];

  const registry = getThemeRegistry((shop as { themeId?: string }).themeId ?? "minimal");

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
            shop.slug,
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <EditorBridge />

      <div className="pb-20">
        <div className="px-5 md:px-10 pt-10 pb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">Search</h1>
          <SearchInput shopSlug={slug} initialQuery={q} />
        </div>

        {q.trim() && (
          <div className="px-5 md:px-10 mb-4">
            <p className="text-sm text-neutral-400">
              {products.length === 0
                ? `No results for "${q}"`
                : `${products.length} result${products.length !== 1 ? "s" : ""} for "${q}"`}
            </p>
          </div>
        )}

        {products.length > 0 && (
          <div className="px-5 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <CollectionItem
                  key={product.id}
                  product={product}
                  currency={shop.currency}
                  shopSlug={shop.slug}
                />
              ))}
            </div>
          </div>
        )}

        {pageSections.map((section) => {
          const Component = registry[section.type] as React.ComponentType<
            ShopSection["props"]
          >;
          if (!Component) return null;
          return (
            <div key={section.id} data-section-id={section.id}>
              <Section container={!noContainerTypes.has(section.type)}>
                <Component
                  {...section.props}
                  shopId={shop.id}
                  shopSlug={shop.slug}
                  shopName={shop.name}
                  currency={shop.currency}
                />
              </Section>
            </div>
          );
        })}
      </div>
    </>
  );
}
