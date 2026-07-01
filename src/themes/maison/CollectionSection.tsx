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

  // LIST: name + price with long dash separator
  if (variant === "list") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} mb-12 flex items-end justify-between`}>
          <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)]`}>
            {category.name}
          </h2>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            View all
          </Link>
        </div>
        <div className={themeConfig.layout.contentPx}>
          {products.map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group flex items-center py-6 border-t border-[var(--subtle)] last:border-b hover:opacity-70 transition-opacity"
              >
                <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-[var(--surface)]">
                  {mainImage ? (
                    <Image src={mainImage.url} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <p className={`ml-6 flex-1 text-[12px] tracking-[0.12em] uppercase text-[var(--primary)]`}>
                  {product.name}
                </p>
                <span className="text-[var(--subtle)] mx-6">—</span>
                <p className="text-[11px] tracking-[0.05em] text-[var(--muted)] shrink-0">
                  {currency} {minPrice.toFixed(2)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // FEATURED: 2-col full-height editorial, tall portrait
  if (variant === "featured") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} mb-12 flex items-end justify-between`}>
          <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)]`}>
            {category.name}
          </h2>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            View all
          </Link>
        </div>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16`}>
          {products.slice(0, 4).map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group block"
              >
                <div
                  className="relative w-full overflow-hidden bg-[var(--surface)]"
                  style={{ aspectRatio: "2/3" }}
                >
                  {mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="mt-5">
                  <p className="text-[12px] tracking-[0.12em] uppercase text-[var(--primary)] mt-4">
                    {product.name}
                  </p>
                  <p className="text-[11px] tracking-[0.05em] text-[var(--muted)] mt-1">
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

  // GRID (default): tall portrait cards, no backgrounds
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} mb-12 flex items-end justify-between`}>
        <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)]`}>
          {category.name}
        </h2>
        <Link
          href={`${base}/collections/${category.slug}`}
          className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
        >
          View all
        </Link>
      </div>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14`}>
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
                className="relative w-full overflow-hidden bg-[var(--surface)]"
                style={{ aspectRatio: "2/3" }}
              >
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-[12px] tracking-[0.12em] uppercase text-[var(--primary)]">
                  {product.name}
                </p>
                <p className="text-[11px] tracking-[0.05em] text-[var(--muted)] mt-1">
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
