import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { getShopBase } from "@/lib/shop-base";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) return { title: "Not Found" };
  const page = await prisma.page.findUnique({
    where: { shopId_slug: { shopId: shopResult.data.id, slug: pageSlug } },
    select: { title: true },
  });
  if (!page) return { title: "Not Found" };
  return { title: `${page.title} — ${shopResult.data.name}` };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>;
}) {
  const { slug, pageSlug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const page = await prisma.page.findUnique({
    where: { shopId_slug: { shopId: shop.id, slug: pageSlug } },
  });
  if (!page || !page.isPublished) notFound();

  const sectionsResult = await getShopSections(shop.id);
  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const registry = getThemeRegistry((shop as { themeId?: string }).themeId ?? "minimal");
  const shopBase = await getShopBase(slug);
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

      <div className="px-5 md:px-10 py-12 max-w-3xl mx-auto">
        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </>
  );
}
