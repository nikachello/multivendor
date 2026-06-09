import { notFound } from "next/navigation";
import {
  getShopBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  getShopSections,
} from "@/lib/data/queries";
import { sectionRegistry } from "@/lib/section-registry";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}) {
  const { slug, categorySlug } = await params;

  const shopResult = getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const categoryResult = getCategoryBySlug(shop.id, categorySlug);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;

  const productsResult = getProductsByCategory(shop.id, category.id);
  const products = productsResult.ok ? productsResult.data : [];

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

      <div className="pb-20">
        <CollectionContainer
          category={category}
          products={products}
          currency={shop.currency}
          shopSlug={shop.slug}
        />
      </div>
    </>
  );
}
