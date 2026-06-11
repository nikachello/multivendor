import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getShopBySlug,
  getProductBySlug,
  getShopSections,
} from "@/lib/db/queries";
import { sectionRegistry } from "@/lib/section-registry";
import ProductDetail from "@/components/storefront/product/ProductDetail";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}): Promise<Metadata> {
  const { slug, productSlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) return { title: "Not Found" };

  const productResult = await getProductBySlug(shopResult.data.id, productSlug);
  if (!productResult.ok) return { title: "Not Found" };

  const { name, description } = productResult.data;
  return {
    title: `${name} — ${shopResult.data.name}`,
    description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const productResult = await getProductBySlug(shop.id, productSlug);
  if (!productResult.ok) notFound();
  const product = productResult.data;

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

      <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
        <ProductDetail
          product={product}
          currency={shop.currency}
          shopSlug={shop.slug}
          shopName={shop.name}
          shopId={shop.id}
        />
      </div>
    </>
  );
}
