import { getCategoriesByShop, getProductsByCategory } from "@/lib/data/queries";

import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import { CollectionSectionProps } from "@/lib/types/sections";

type Props = CollectionSectionProps & {
  shopId?: string;
  currency?: string;
};

const CollectionSection = async ({ categoryId, shopId, currency }: Props) => {
  if (!shopId || !currency) return null;

  const categoriesResult = getCategoriesByShop(shopId);

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
      />
    </div>
  );
};

export default CollectionSection;
