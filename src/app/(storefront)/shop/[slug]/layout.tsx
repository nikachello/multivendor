import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/data/queries";
import CartDrawer from "@/components/storefront/cart/CartDrawer";

// This layout wraps every page under /shop/[slug]/ (main, product, collection,
// checkout). Rendering CartDrawer here means one instance per shop visit,
// always available wherever the navbar cart icon is visible.
export default async function ShopSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = getShopBySlug(slug);
  if (!result.ok) notFound();
  const shop = result.data;

  return (
    <>
      {children}
      <CartDrawer shopId={shop.id} shopSlug={shop.slug} currency={shop.currency} />
    </>
  );
}
