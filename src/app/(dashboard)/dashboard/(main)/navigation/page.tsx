import type { Metadata } from "next";
import { getShopSections, getCategoriesByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { NavbarSectionProps } from "@/lib/types/sections";
import MenuEditor from "@/components/dashboard/navigation/MenuEditor";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.sidebar.navigation };
}

export default async function NavigationPage() {
  const shop = await getShop();

  const [sectionsResult, categoriesResult] = await Promise.all([
    getShopSections(shop.id),
    getCategoriesByShop(shop.id),
  ]);

  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const initialItems = (navbarSection?.props as NavbarSectionProps)?.items ?? [];
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <MenuEditor
      shopId={shop.id}
      shopSlug={shop.slug}
      initialItems={initialItems}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  );
}
