import { notFound } from "next/navigation";
import { getShopBySlug, searchProducts, getShopSections } from "@/lib/db/queries";
import { sectionRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import CollectionItem from "@/components/storefront/collection/CollectionItem";
import SearchInput from "./SearchInput";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q = "" } = await searchParams;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const sectionsResult = await getShopSections(shop.id);
  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const NavbarComponent = sectionRegistry["navbar"] as React.ComponentType<
    NavbarSectionProps & { shopId?: string; shopSlug?: string; shopName?: string; transparent?: boolean }
  >;

  const productsResult = q.trim() ? await searchProducts(shop.id, q.trim()) : null;
  const products = productsResult?.ok ? productsResult.data : [];

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
        <div className="px-5 md:px-10 pt-10 pb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">Search</h1>
          <SearchInput shopSlug={slug} initialQuery={q} />
        </div>

        {q.trim() && (
          <div className="px-5 md:px-10 mb-4">
            <p className="text-sm text-neutral-400">
              {products.length === 0
                ? `No results for "${q}"`
                : `${products.length} result${products.length !== 1 ? "s" : ""} for "${q}"`}
            </p>
          </div>
        )}

        {products.length > 0 && (
          <div className="px-5 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <CollectionItem
                  key={product.id}
                  product={product}
                  currency={shop.currency}
                  shopSlug={shop.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
