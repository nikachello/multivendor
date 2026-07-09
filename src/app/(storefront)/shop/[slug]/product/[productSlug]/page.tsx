import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getProductBySlug,
  getShopSections,
} from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { getThemeConfig } from "@/themes";
import ProductDetail from "@/components/storefront/product/ProductDetail";
import CreatorProductPage from "@/themes/creator/sections/CreatorProductPage";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { ShopSection } from "@/lib/types/store-section";
import Section from "@/components/storefront/layout/Section";
import EditorBridge from "@/components/storefront/EditorBridge";
import { getShopBase } from "@/lib/shop-base";
import { getCanonicalShopUrl } from "@/lib/storefront-url";
import { safeJsonLd } from "@/lib/utils";

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
  const canonicalUrl = getCanonicalShopUrl(shop, `/product/${productSlug}`);
  return {
    title: `${product.name} — ${shop.name}`,
    description: product.description ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${product.name} — ${shop.name}`,
      description: product.description ?? undefined,
      url: canonicalUrl,
      siteName: shop.name,
      type: "website",
      ...(firstImage && { images: [{ url: firstImage, alt: product.name }] }),
    },
    twitter: {
      card: firstImage ? "summary_large_image" : "summary",
      title: `${product.name} — ${shop.name}`,
      description: product.description ?? undefined,
      ...(firstImage && { images: [firstImage] }),
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

  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const registry = getThemeRegistry(themeId);
  const themeConfig = getThemeConfig(themeId);
  const shopBase = await getShopBase(slug);

  const navbarSection = homeSections.find((s) => s.type === "navbar");
  const NavbarComponent = registry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopName?: string; shopSlug?: string }
  >;

  const noContainerTypes = new Set([
    "banner", "announcement", "navbar", "testimonials", "product-testimonials", "collection", "newsletter", "divider",
  ]);

  const inStock = product.variants.some(
    (v) => !v.trackInventory || v.stock > 0,
  );

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
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: getCanonicalShopUrl(shop, `/product/${productSlug}`),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
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

      {themeId === "creator" ? (() => {
        const productSettings = pageSections.find((s) => s.type === "creator-product-settings")?.props ?? {};
        const ctaLabel = typeof productSettings.ctaLabel === "string" && productSettings.ctaLabel ? productSettings.ctaLabel : "Add to cart";
        const showQuantity = productSettings.showQuantity !== "false";
        const showShipping = productSettings.showShipping === "true";
        const shippingNote = typeof productSettings.shippingNote === "string" && productSettings.shippingNote ? productSettings.shippingNote : "Free shipping over 50 GEL";
        return (
          <CreatorProductPage
            product={{
              id: product.id,
              name: product.name,
              description: product.description ?? undefined,
              images: product.images.map((img) => img.url),
              priceFrom: Number(product.priceFrom),
              variants: product.variants.map((v) => ({
                id: v.id,
                price: Number(v.price),
                stock: v.stock,
                trackInventory: v.trackInventory,
                image: v.image ?? undefined,
                optionValues: v.optionValues.map((ov) => ({
                  name: ov.optionValue.optionType.name,
                  value: ov.optionValue.value,
                })),
              })),
            }}
            shopId={shop.id}
            shopBase={shopBase}
            currency={shop.currency}
            ctaLabel={ctaLabel}
            showQuantity={showQuantity}
            showShipping={showShipping}
            shippingNote={shippingNote}
          />
        );
      })() : (
        <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
          <ProductDetail
            product={product}
            currency={shop.currency}
            shopSlug={shop.slug}
            shopBase={shopBase}
            shopName={shop.name}
            shopId={shop.id}
          />
        </div>
      )}

      <EditorBridge />

      {pageSections.map((section) => {
        const Component = registry[section.type] as React.ComponentType<
          ShopSection["props"]
        > | undefined;
        if (!Component) return null;
        const extraProps = {
          shopId: shop.id,
          shopSlug: shop.slug,
          shopBase,
          shopName: shop.name,
          currency: shop.currency,
          productId: product.id,
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
    </>
  );
}
