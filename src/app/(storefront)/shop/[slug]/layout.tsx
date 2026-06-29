import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/db/queries";
import CartDrawer from "@/components/storefront/cart/CartDrawer";
import { getThemeConfig } from "@/themes";

// This layout wraps every page under /shop/[slug]/ (main, product, collection,
// checkout). Rendering CartDrawer here means one instance per shop visit,
// always available wherever the navbar cart icon is visible.
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
      {children}
      <CartDrawer
        shopId={shop.id}
        shopSlug={shop.slug}
        currency={shop.currency}
      />
    </div>
  );
}
