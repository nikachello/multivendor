import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getProductBySlug,
  getShopSections,
} from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import ProductDetail from "@/components/storefront/product/ProductDetail";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { ShopSection } from "@/lib/types/store-section";
import Section from "@/components/storefront/layout/Section";
import EditorBridge from "@/components/storefront/EditorBridge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) return { title: "Not Found" };

  const productResult = await getProductBySlug(shopResult.data.id, productSlug);
  if (!productResult.ok) return { title: "Not Found" };

  const product = productResult.data;
  const shop = shopResult.data;
  const firstImage = product.images?.[0]?.url;
  return {
    title: `${product.name} — ${shop.name}`,
    description: product.description ?? undefined,
    openGraph: {
      title: `${product.name} — ${shop.name}`,
      description: product.description ?? undefined,
      url: `/shop/${slug}/product/${productSlug}`,
      siteName: shop.name,
      type: "website",
      ...(firstImage && { images: [{ url: firstImage, alt: product.name }] }),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const productResult = await getProductBySlug(shop.id, productSlug);
  if (!productResult.ok) notFound();
  const product = productResult.data;

  const [homeSectionsResult, pageSectionsResult] = await Promise.all([
    getShopSections(shop.id, "home"),
    getShopSections(shop.id, "product"),
  ]);

  const homeSections = homeSectionsResult.ok ? homeSectionsResult.data : [];
  const pageSections = pageSectionsResult.ok ? pageSectionsResult.data : [];

  const registry = getThemeRegistry((shop as { themeId?: string }).themeId ?? "minimal");

  const navbarSection = homeSections.find((s) => s.type === "navbar");
  const NavbarComponent = registry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopName?: string; shopSlug?: string }
  >;

  const noContainerTypes = new Set([
    "banner", "announcement", "navbar", "testimonials", "collection", "newsletter", "divider",
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.map((img) => img.url) ?? [],
    offers: {
      "@type": "Offer",
      price: product.priceFrom,
      priceCurrency: shop.currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
        <ProductDetail
          product={product}
          currency={shop.currency}
          shopSlug={shop.slug}
          shopName={shop.name}
          shopId={shop.id}
        />
      </div>

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
                shopName={shop.name}
                currency={shop.currency}
              />
            </Section>
          </div>
        );
      })}
    </>
  );
}
