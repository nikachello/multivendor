import Link from "next/link";
import Image from "next/image";
import { Category } from "@/generated/prisma/client";
import { ProductWithRelations } from "@/lib/db/queries";

type Props = {
  category: Category;
  products: ProductWithRelations[];
  currency: string;
  shopSlug: string;
};

export default function CollectionList({ category, products, currency, shopSlug }: Props) {
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
        <div className="flex flex-col divide-y divide-neutral-100">
          {products.map((product) => {
            const lowestPrice = product.variants.length
              ? Math.min(...product.variants.map((v) => Number(v.price)))
              : 0;
            const mainImage = product.images[0]?.url;

            return (
              <Link
                key={product.id}
                href={`/shop/${shopSlug}/product/${product.slug}`}
                className="flex items-center gap-5 py-4 group"
              >
                <div className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 overflow-hidden">
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                  {product.description && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <p className="text-sm text-neutral-700 flex-shrink-0">
                  {currency} {lowestPrice.toFixed(2)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
