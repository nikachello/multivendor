import { Category } from "@/generated/prisma/client";
import { ProductWithRelations } from "@/lib/db/queries";
import CollectionItem from "./CollectionItem";

type Props = {
  category: Category;
  products: ProductWithRelations[];
  currency: string;
  shopSlug: string;
};

export default function CollectionFeatured({ category, products, currency, shopSlug }: Props) {
  const [featured, ...rest] = products;
  const side = rest.slice(0, 3);

  return (
    <div className="px-5 md:px-10 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{category.name}</h2>
        {category.description && (
          <p className="mt-3 text-gray-600 text-sm">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-neutral-400 text-sm">No products here yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-2 row-span-2">
            {featured && (
              <CollectionItem product={featured} currency={currency} shopSlug={shopSlug} />
            )}
          </div>
          {side.map((product) => (
            <CollectionItem key={product.id} product={product} currency={currency} shopSlug={shopSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
