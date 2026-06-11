import { Category, Product } from "@/generated/prisma/client";
import CollectionItem from "./CollectionItem";
import { ProductWithRelations } from "@/lib/db/queries";

type Props = {
  category: Category;
  products: ProductWithRelations[];
  currency: string;
  shopSlug: string;
};

const CollectionContainer = ({
  category,
  products,
  currency,
  shopSlug,
}: Props) => {
  return (
    <div className="px-5 md:px-10 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {category.name}
        </h2>

        <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* GRID */}
      {products.length === 0 ? (
        <div className="py-20 text-center text-neutral-400 text-sm">
          No products here yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <CollectionItem
              key={product.id}
              product={product}
              currency={currency}
              shopSlug={shopSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionContainer;
