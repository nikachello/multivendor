import { notFound } from "next/navigation";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { NavbarSectionProps } from "@/lib/types/sections";
import MenuEditor from "@/components/dashboard/navigation/MenuEditor";

const SHOP_SLUG = "niko-watches";

export default async function NavigationPage() {
  const shopResult = await getShopBySlug(SHOP_SLUG);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const sectionsResult = await getShopSections(shop.id);
  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const initialItems = (navbarSection?.props as NavbarSectionProps)?.items ?? [];

  return <MenuEditor shopId={shop.id} initialItems={initialItems} />;
}
