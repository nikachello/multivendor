import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import ShopInitializer from "@/components/storefront/ShopInitializer";
import { shops, categories, products } from "@/lib/mock-data";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log(slug);

  // 1. find shop
  const shop = shops.find((s) => s.slug === slug);

  if (!shop) return <div>Shop not found</div>;

  // 2. shop data
  const shopCategories = categories.filter((c) => c.shopId === shop.id);

  const shopProducts = products.filter((p) => p.shopId === shop.id);

  // 3. pick collection (first one for now)
  const category = shopCategories[0];

  const collectionProducts = shopProducts.filter(
    (p) => p.categoryId === category.id
  );

  return (
    <div>
      <ShopInitializer shop={shop} />
      <CollectionContainer category={category} products={collectionProducts} />
    </div>
  );
}
