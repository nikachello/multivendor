import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import { getCategoriesByShop, getProductsByCategory } from "@/lib/db/queries";
import type { CollectionSectionProps } from "@/lib/types/sections";

type Props = CollectionSectionProps & {
  shopId?: string;
  shopSlug?: string;
  shopBase?: string;
  currency?: string;
  themeConfig: ThemeConfig;
};

const CollectionSection = async ({ categoryId, shopId, shopSlug, shopBase, currency, themeConfig }: Props) => {
  if (!shopId || !shopSlug || !currency) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const categoriesResult = await getCategoriesByShop(shopId);
  if (!categoriesResult.ok) return null;

  const category = categoriesResult.data.find((c) => c.id === categoryId);
  if (!category) return null;

  const productsResult = await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;

  const products = productsResult.data;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} mb-10 flex items-end justify-between`}>
        <h2 className={themeConfig.type.sectionHeading}>{category.name}</h2>
        <Link
          href={`${base}/collections/${category.slug}`}
          className={`${themeConfig.type.label} hover:opacity-70 transition-opacity border-b border-[var(--subtle)] pb-px`}
        >
          View all
        </Link>
      </div>
      <div className={`${themeConfig.layout.contentPx} grid ${themeConfig.layout.productGridCols} gap-x-4 gap-y-10`}>
        {products.map((product) => {
          const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
          const minPrice = Math.min(...product.variants.map((v) => v.price));

          return (
            <Link
              key={product.id}
              href={`${base}/product/${product.slug}`}
              className="group block"
            >
              <div
                className={`relative w-full overflow-hidden ${themeConfig.components.productImage.bg}`}
                style={{ aspectRatio: themeConfig.components.productImage.aspectRatio }}
              >
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--subtle)]" />
                )}
              </div>
              <div className="mt-3">
                <p className={themeConfig.type.cardHeading}>{product.name}</p>
                <p className={`mt-1 ${themeConfig.type.price}`}>
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
