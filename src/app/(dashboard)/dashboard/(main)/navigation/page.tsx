import { notFound } from "next/navigation";
import { getShopBySlug, getShopSections, getCategoriesByShop } from "@/lib/db/queries";
import { NavbarSectionProps } from "@/lib/types/sections";
import MenuEditor from "@/components/dashboard/navigation/MenuEditor";

const SHOP_SLUG = "niko-watches";

export default async function NavigationPage() {
  const shopResult = await getShopBySlug(SHOP_SLUG);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

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
      initialItems={initialItems}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  );
}
