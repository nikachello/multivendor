import { notFound } from "next/navigation";
import { getShopBySlug, getShopSections } from "@/lib/data/queries";
import SectionEditor from "@/components/dashboard/editor/SectionEditor";

// Hardcoded to niko-watches until auth + shop-picker is built.
// When auth lands, replace with: getShopByOwnerId(session.user.id)
const EDITOR_SHOP_SLUG = "niko-watches";

export default async function EditorPage() {
  const shopResult = getShopBySlug(EDITOR_SHOP_SLUG);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const sectionsResult = getShopSections(shop.id);
  if (!sectionsResult.ok) notFound();

  return (
    <SectionEditor
      initialSections={sectionsResult.data}
      shopId={shop.id}
      shopSlug={shop.slug}
      shopName={shop.name}
      currency={shop.currency}
    />
  );
}
