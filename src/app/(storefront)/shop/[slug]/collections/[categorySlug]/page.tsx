import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  getShopSections,
} from "@/lib/db/queries";
import { sectionRegistry } from "@/lib/section-registry";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { slug, categorySlug } = await params;
  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) return { title: "Not Found" };
  const categoryResult = await getCategoryBySlug(
    shopResult.data.id,
    categorySlug,
  );
  if (!categoryResult.ok) return { title: "Not Found" };
  return {
    title: `${categoryResult.data.name} — ${shopResult.data.name}`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string; categorySlug: string }>;
}) {
  const { slug, categorySlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const categoryResult = await getCategoryBySlug(shop.id, categorySlug);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;

  const productsResult = await getProductsByCategory(shop.id, category.id);
  const products = productsResult.ok ? productsResult.data : [];

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
            shop.slug,
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <div className="pb-20">
        <nav className="flex items-center gap-2 text-xs text-neutral-400 px-5 md:px-10 pt-8">
          <a
            href={`/shop/${shop.slug}`}
            className="hover:text-neutral-600 transition-colors"
          >
            {shop.name}
          </a>
          <span>/</span>
          <span className="text-neutral-600">{category.name}</span>
        </nav>

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
