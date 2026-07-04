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

  // Storefront goes offline 7 days after subscription expires
  const paidUntil = shop.subscriptionPaidUntil;
  const graceDeadline = paidUntil
    ? new Date(new Date(paidUntil).getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;
  const isOffline = !graceDeadline || graceDeadline < new Date();

  if (isOffline) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f7" }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>
            Store temporarily unavailable
          </h1>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}>
            This store is currently offline. If you are the owner, please renew your subscription to bring it back online.
          </p>
        </div>
      </div>
    );
  }
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
