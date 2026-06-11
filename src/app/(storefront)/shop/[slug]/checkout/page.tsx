import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { sectionRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import CheckoutForm from "@/components/storefront/checkout/CheckoutForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return { title: "Not Found" };
  return { title: `Checkout — ${result.data.name}` };
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
  const NavbarComponent = sectionRegistry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopName?: string }
  >;

  return (
    <>
      {navbarSection && NavbarComponent && (
        <NavbarComponent
          {...(navbarSection.props as NavbarSectionProps)}
          items={resolveNavItems(
            (navbarSection.props as NavbarSectionProps).items ?? [],
            shop.slug
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
        <CheckoutForm
          shopId={shop.id}
          shopSlug={shop.slug}
          shopName={shop.name}
          currency={shop.currency}
        />
      </div>
    </>
  );
}
