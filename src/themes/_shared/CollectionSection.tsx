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

  if (variant === "list") {
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
        <div className={`${themeConfig.layout.contentPx} flex flex-col divide-y divide-[var(--subtle)]`}>
          {products.map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group flex items-center gap-6 py-5 hover:opacity-80 transition-opacity"
              >
                <div
                  className={`relative shrink-0 w-20 h-20 overflow-hidden ${themeConfig.components.productImage.bg}`}
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {mainImage ? (
                    <Image src={mainImage.url} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-[var(--subtle)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={themeConfig.type.cardHeading}>{product.name}</p>
                </div>
                <p className={`shrink-0 ${themeConfig.type.price}`}>
                  {currency} {minPrice.toFixed(2)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === "featured") {
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
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12`}>
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
                  style={{ aspectRatio: "3/4" }}
                >
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--subtle)]" />
                  )}
                </div>
                <div className="mt-4">
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
  }

  // grid (default)
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
