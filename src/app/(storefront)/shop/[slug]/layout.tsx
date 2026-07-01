import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/db/queries";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import StorefrontFooter from "@/components/storefront/layout/StorefrontFooter";
import StorefrontPixel from "@/components/storefront/tracking/StorefrontPixel";
import StorefrontGA4 from "@/components/storefront/tracking/StorefrontGA4";
import StorefrontGoogleAds from "@/components/storefront/tracking/StorefrontGoogleAds";
import { getThemeConfig } from "@/themes";
import { getShopBase } from "@/lib/shop-base";

export default async function ShopSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) notFound();
  const shop = result.data;
  const shopBase = await getShopBase(slug);

  const themeConfig = getThemeConfig((shop as { themeId?: string }).themeId ?? "minimal");

  const fontMap: Record<string, string> = {
    sans: "system-ui, sans-serif",
    serif: "Georgia, serif",
    mono: "ui-monospace, monospace",
    jakarta: "var(--font-jakarta), system-ui, sans-serif",
  };
  const radiusMap: Record<string, string> = {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "16px",
  };

  return (
    <div
      data-theme-root
      style={
        {
          "--primary": shop.primaryColor,
          "--secondary": shop.secondaryColor,
          "--page-bg": shop.pageBackground,
          "--font": fontMap[shop.fontFamily] ?? fontMap.sans,
          "--radius": radiusMap[shop.borderRadius] ?? "0px",
          "--accent": themeConfig.palette.accent,
          "--muted": themeConfig.palette.muted,
          "--subtle": themeConfig.palette.subtle,
          "--surface": themeConfig.palette.surface,
          ...themeConfig.extras,
          fontFamily: "var(--font)",
          backgroundColor: "var(--page-bg)",
        } as React.CSSProperties
      }
    >
      <StorefrontPixel pixelId={shop.metaPixelId ?? ""} />
      <StorefrontGA4 measurementId={shop.ga4MeasurementId ?? ""} />
      <StorefrontGoogleAds googleAdsId={shop.googleAdsId ?? ""} />
      {children}
      <StorefrontFooter shopName={shop.name} shopBase={shopBase} />
      <CartDrawer
        shopId={shop.id}
        shopSlug={shop.slug}
        shopBase={shopBase}
        currency={shop.currency}
      />
    </div>
  );
}
