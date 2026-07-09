import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/db/queries";
import prisma from "@/lib/db/prisma";
import { NavItem } from "@/lib/types/sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return {};
  return {
    title: {
      template: `%s | ${result.data.name}`,
      default: result.data.name,
    },
  };
}
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

  const footerSection = await prisma.shopSection.findFirst({
    where: { shopId: shop.id, type: "footerNav" },
    select: { props: true },
  });
  const footerItems = ((footerSection?.props as { items?: NavItem[] })?.items) ?? [];

  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const themeConfig = getThemeConfig(themeId);
  const isCreatorTheme = themeId === "creator";

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
      {isCreatorTheme && (
        <>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Public+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <style>{`
            @media (prefers-color-scheme: dark) {
              [data-theme-root] {
                --creator-accent: #E2895F;
                --creator-muted: #9C9284;
                --creator-subtle: #34302A;
                --creator-surface: #221E19;
                --creator-on-surface: #F5F1E9;
                --creator-link-btn-bg: #2C2820;
              }
            }
          `}</style>
        </>
      )}
      <StorefrontPixel pixelId={shop.metaPixelId ?? ""} />
      <StorefrontGA4 measurementId={shop.ga4MeasurementId ?? ""} />
      <StorefrontGoogleAds googleAdsId={shop.googleAdsId ?? ""} />
      {children}
      {!isCreatorTheme && (
        <StorefrontFooter shopName={shop.name} shopBase={shopBase} footerItems={footerItems} />
      )}
      <CartDrawer
        shopId={shop.id}
        shopSlug={shop.slug}
        shopBase={shopBase}
        currency={shop.currency}
      />
    </div>
  );
}
