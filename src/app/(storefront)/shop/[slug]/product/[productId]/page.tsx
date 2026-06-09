import { notFound } from "next/navigation";
import {
  getShopBySlug,
  getProductById,
  getShopSections,
} from "@/lib/data/queries";
import { sectionRegistry } from "@/lib/section-registry";
import ProductDetail from "@/components/storefront/product/ProductDetail";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  const shopResult = getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const productResult = getProductById(shop.id, productId);
  if (!productResult.ok) notFound();
  const product = productResult.data;

  // Reuse the shop's navbar section so it stays consistent
  const sectionsResult = getShopSections(shop.id);
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
        <ProductDetail
          product={product}
          currency={shop.currency}
          shopSlug={shop.slug}
          shopName={shop.name}
        />
      </div>
    </>
  );
}
