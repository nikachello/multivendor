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

const CollectionSection = async ({
  categoryId,
  shopId,
  shopSlug,
  shopBase,
  currency,
  themeConfig,
  variant = "grid",
}: Props) => {
  if (!shopId || !shopSlug || !currency) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const categoriesResult = await getCategoriesByShop(shopId);
  if (!categoriesResult.ok) return null;
  const category = categoriesResult.data.find((c) => c.id === categoryId);
  if (!category) return null;

  const productsResult = await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;
  const products = productsResult.data;

  // LIST: horizontal rows separated by thin dividers
  if (variant === "list") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} flex items-baseline justify-between mb-10`}>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            {category.name}
          </span>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className={themeConfig.layout.contentPx}>
          {products.map((product, idx) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group flex items-center py-5 hover:opacity-60 transition-opacity"
              >
                {idx > 0 && <div className="absolute left-0 right-0 -mt-5 border-t border-neutral-100" />}
                <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-neutral-50">
                  {mainImage ? (
                    <Image src={mainImage.url} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                </div>
                <p className="ml-5 flex-1 text-sm font-medium text-neutral-900">{product.name}</p>
                <p className="text-sm text-neutral-400 shrink-0">
                  {currency} {minPrice.toFixed(2)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // FEATURED: 2-col portrait 2:3
  if (variant === "featured") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} flex items-baseline justify-between mb-10`}>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            {category.name}
          </span>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14`}>
          {products.slice(0, 4).map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group block"
              >
                <div className="relative w-full overflow-hidden bg-neutral-50" style={{ aspectRatio: "2/3" }}>
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    {currency} {minPrice.toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // GRID (default): 4-col, edge-to-edge images, no card bg
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} flex items-baseline justify-between mb-10`}>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
          {category.name}
        </span>
        <Link
          href={`${base}/collections/${category.slug}`}
          className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10`}>
        {products.map((product) => {
          const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
          const minPrice = Math.min(...product.variants.map((v) => v.price));
          return (
            <Link
              key={product.id}
              href={`${base}/product/${product.slug}`}
              className="group block"
            >
              <div className="relative w-full overflow-hidden bg-neutral-50" style={{ aspectRatio: "1/1" }}>
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:opacity-80 transition-opacity duration-200"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100" />
                )}
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                <p className="text-sm text-neutral-400 mt-0.5">
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
