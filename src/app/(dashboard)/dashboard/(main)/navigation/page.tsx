import type { Metadata } from "next";
import { getShopSections, getCategoriesByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { NavbarSectionProps } from "@/lib/types/sections";
import { getDict } from "@/i18n";
import prisma from "@/lib/db/prisma";
import NavigationTabs from "./NavigationTabs";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.sidebar.navigation };
}

export default async function NavigationPage() {
  const shop = await getShop();

  const [sectionsResult, categoriesResult, pages, footerSection] = await Promise.all([
    getShopSections(shop.id),
    getCategoriesByShop(shop.id),
    prisma.page.findMany({ where: { shopId: shop.id }, select: { slug: true, title: true } }),
    prisma.shopSection.findFirst({ where: { shopId: shop.id, type: "footerNav" } }),
  ]);

  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const initialNavItems = (navbarSection?.props as NavbarSectionProps)?.items ?? [];
  const initialFooterItems = (footerSection?.props as { items?: NavbarSectionProps["items"] })?.items ?? [];
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <NavigationTabs
      shopId={shop.id}
      shopSlug={shop.slug}
      initialNavItems={initialNavItems}
      initialFooterItems={initialFooterItems}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      pages={pages}
    />
  );
}
