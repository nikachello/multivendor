import { getCategoriesByShop, getProductsByCategory } from "@/lib/db/queries";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import CollectionFeatured from "@/components/storefront/collection/CollectionFeatured";
import CollectionList from "@/components/storefront/collection/CollectionList";
import { CollectionSectionProps } from "@/lib/types/sections";

type Props = CollectionSectionProps & {
  shopId?: string;
  shopSlug?: string;
  currency?: string;
};

const CollectionSection = async ({
  categoryId,
  shopId,
  shopSlug,
  currency,
  variant = "grid",
}: Props) => {
  if (!shopId || !shopSlug || !currency) return null;

  const categoriesResult = await getCategoriesByShop(shopId);
  if (!categoriesResult.ok) return null;

  const category = categoriesResult.data.find((c) => c.id === categoryId);
  if (!category) return null;

  const productsResult = await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;

  const products = productsResult.data;

  if (variant === "featured") {
    return <CollectionFeatured category={category} products={products} currency={currency} shopSlug={shopSlug} />;
  }

  if (variant === "list") {
    return <CollectionList category={category} products={products} currency={currency} shopSlug={shopSlug} />;
  }

  return (
    <div className="pt-20">
      <CollectionContainer category={category} products={products} currency={currency} shopSlug={shopSlug} />
    </div>
  );
};

export default CollectionSection;
