import { getCategoriesByShop, getProductsByCategory } from "@/lib/db/queries";

import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
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
}: Props) => {
  if (!shopId || !shopSlug || !currency) return null;

  const categoriesResult = await getCategoriesByShop(shopId);

  if (!categoriesResult.ok) {
    return null;
  }

  const categories = categoriesResult.data;

  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null;

  const productsResult = getProductsByCategory(shopId, categoryId);

  if (!productsResult.ok) {
    return null;
  }

  const products = productsResult.data;

  return (
    <div className="pt-20">
      <CollectionContainer
        category={category}
        products={products}
        currency={currency}
        shopSlug={shopSlug}
      />
    </div>
  );
};

export default CollectionSection;
