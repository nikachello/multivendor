import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  getShopSections,
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
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}) {
  const { slug, categorySlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const categoryResult = await getCategoryBySlug(shop.id, categorySlug);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;

  const [productsResult, homeSectionsResult, pageSectionsResult] =
    await Promise.all([
      getProductsByCategory(shop.id, category.id),
      getShopSections(shop.id, "home"),
      getShopSections(shop.id, "collection"),
    ]);

  const products = productsResult.ok ? productsResult.data : [];
  const homeSections = homeSectionsResult.ok ? homeSectionsResult.data : [];
  const pageSections = pageSectionsResult.ok ? pageSectionsResult.data : [];

  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const registry = getThemeRegistry(themeId);
  const themeConfig = getThemeConfig(themeId);
  const shopBase = await getShopBase(slug);

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
        />

        <EditorBridge />

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
                  shopBase={shopBase}
                  shopName={shop.name}
                  currency={shop.currency}
                  themeConfig={themeConfig}
                />
              </Section>
            </div>
          );
        })}
      </div>
    </>
  );
}
