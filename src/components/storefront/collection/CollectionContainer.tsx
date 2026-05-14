import CollectionItem from "./CollectionItem";
import { Category, Product } from "@/lib/types";

type Props = {
  category: Category;
  products: Product[];
};

const CollectionContainer = ({ category, products }: Props) => {
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <CollectionItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionContainer;
