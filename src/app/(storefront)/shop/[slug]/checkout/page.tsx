import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import CheckoutForm from "@/components/storefront/checkout/CheckoutForm";
import { getShopBase } from "@/lib/shop-base";
import CreatorBackButton from "@/themes/creator/sections/CreatorBackButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return { title: "Not Found" };
  return { title: `Checkout — ${result.data.name}`, robots: { index: false } };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const sectionsResult = await getShopSections(shop.id);
  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const registry = getThemeRegistry(themeId);
  const shopBase = await getShopBase(slug);
  const shopPaymentConfig = (shop as { paymentConfig?: Record<string, { enabled?: boolean; clientId?: string }> }).paymentConfig ?? {};
  const hasBogPayment = !!(shopPaymentConfig.bog?.enabled && shopPaymentConfig.bog?.clientId);
  // COD is on by default for backward compat; disabled only when explicitly set false
  const hasCodPayment = shopPaymentConfig.cod?.enabled !== false;
  const NavbarComponent = registry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopName?: string }
  >;

  return (
    <>
      {navbarSection && NavbarComponent && (
        <NavbarComponent
          {...(navbarSection.props as NavbarSectionProps)}
          items={resolveNavItems(
            (navbarSection.props as NavbarSectionProps).items ?? [],
            shopBase
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopBase={shopBase}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
        {themeId === "creator" && <CreatorBackButton />}
        <CheckoutForm
          shopId={shop.id}
          shopSlug={shop.slug}
          shopBase={shopBase}
          shopName={shop.name}
          currency={shop.currency}
          defaultShippingRate={Number(shop.shippingRate)}
          freeThreshold={Number(shop.freeThreshold)}
          shippingZones={(shop.shippingZones as { city_en: string; city_ka: string; rate: number }[]) ?? []}
          hasBogPayment={hasBogPayment}
          hasCodPayment={hasCodPayment}
        />
      </div>
    </>
  );
}
