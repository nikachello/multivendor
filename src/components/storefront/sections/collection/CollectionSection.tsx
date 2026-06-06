import { getCategoriesByShop, getProductsByCategory } from "@/lib/data/queries";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import { CollectionSectionProps } from "@/lib/types/sections";

type Props = CollectionSectionProps & { shopId?: string; currency?: string };

const CollectionSection = async ({ categoryId, shopId, currency }: Props) => {
  if (!shopId || !currency) return null;

  const categories = getCategoriesByShop(shopId);
  const category = categories.find((c) => c.id === categoryId);

  if (!category) return null;

  const products = getProductsByCategory(shopId, categoryId);

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
