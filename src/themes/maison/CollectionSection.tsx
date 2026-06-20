import Image from "next/image";
import Link from "next/link";
import { getCategoriesByShop, getProductsByCategory } from "@/lib/db/queries";
import { CollectionSectionProps } from "@/lib/types/sections";

type Props = CollectionSectionProps & {
  shopId?: string;
  shopSlug?: string;
  currency?: string;
};

const CollectionSection = async ({ categoryId, shopId, shopSlug, currency }: Props) => {
  if (!shopId || !shopSlug || !currency) return null;

  const categoriesResult = await getCategoriesByShop(shopId);
  if (!categoriesResult.ok) return null;

  const category = categoriesResult.data.find((c) => c.id === categoryId);
  if (!category) return null;

  const productsResult = await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;

  const products = productsResult.data;

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      {/* Category heading */}
      <div className="px-5 md:px-10 mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl md:text-4xl font-light text-[#1C1C1C] leading-tight">
          {category.name}
        </h2>
        <Link
          href={`/shop/${shopSlug}/collections/${category.slug}`}
          className="text-[11px] tracking-[0.15em] uppercase text-[#8A8072] hover:text-[#1C1C1C] transition-colors border-b border-[#E2DDD5] pb-px"
        >
          View all
        </Link>
      </div>

      {/* Grid */}
      <div className="px-5 md:px-10 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
        {products.map((product) => {
          const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
          const minPrice = Math.min(...product.variants.map((v) => v.price));

          return (
            <Link
              key={product.id}
              href={`/shop/${shopSlug}/product/${product.slug}`}
              className="group block"
            >
              <div className="relative w-full overflow-hidden bg-[#EDE9E1]" style={{ aspectRatio: "4/5" }}>
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#E2DDD5]" />
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm text-[#1C1C1C] leading-snug">{product.name}</p>
                <p className="mt-1 text-sm text-[#8A8072]">
                  {currency} {minPrice.toFixed(2)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CollectionSection;
