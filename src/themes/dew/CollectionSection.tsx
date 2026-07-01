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

  // LIST: rounded list items with soft bg
  if (variant === "list") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} flex items-center justify-between mb-8`}>
          <h2 className={`${themeConfig.type.sectionHeading} text-2xl`}>{category.name}</h2>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>
        <div className={`${themeConfig.layout.contentPx} flex flex-col gap-3`}>
          {products.map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group flex items-center gap-5 p-4 bg-[var(--surface)] hover:shadow-md transition-shadow"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div
                  className="relative w-16 h-16 shrink-0 overflow-hidden bg-white"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {mainImage ? (
                    <Image src={mainImage.url} alt={product.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <p className="flex-1 text-sm font-medium text-[var(--primary)]">{product.name}</p>
                <p className="text-sm font-semibold text-[var(--accent)] shrink-0">
                  {currency} {minPrice.toFixed(2)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // FEATURED: soft rounded cards, 2-col
  if (variant === "featured") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} flex items-center justify-between mb-8`}>
          <h2 className={`${themeConfig.type.sectionHeading} text-2xl`}>{category.name}</h2>
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-sm font-semibold text-[var(--primary)] hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 sm:grid-cols-2 gap-6`}>
          {products.slice(0, 4).map((product) => {
            const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            return (
              <Link
                key={product.id}
                href={`${base}/product/${product.slug}`}
                className="group block bg-[var(--surface)] shadow-sm hover:shadow-md transition-shadow"
                style={{ borderRadius: "var(--radius)" }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: "1/1", borderRadius: "var(--radius) var(--radius) 0 0" }}
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
                <div className="p-4">
                  <p className="text-sm font-medium text-[var(--primary)]">{product.name}</p>
                  <p className="text-sm font-semibold text-[var(--accent)] mt-1">
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

  // GRID (default): rounded cards, 1:1 images, soft bg, shadow on hover
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} flex items-center justify-between mb-8`}>
        <h2 className={`${themeConfig.type.sectionHeading} text-2xl`}>{category.name}</h2>
        <Link
          href={`${base}/collections/${category.slug}`}
          className="text-sm font-semibold text-[var(--primary)] hover:opacity-70 transition-opacity"
        >
          View all →
        </Link>
      </div>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-4 gap-4`}>
        {products.map((product) => {
          const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
          const minPrice = Math.min(...product.variants.map((v) => v.price));
          return (
            <Link
              key={product.id}
              href={`${base}/product/${product.slug}`}
              className="group block bg-[var(--surface)] shadow-sm hover:shadow-md transition-shadow"
              style={{ borderRadius: "var(--radius)" }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "1/1", borderRadius: "var(--radius) var(--radius) 0 0" }}
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
              <div className="p-3">
                <p className="text-sm font-medium text-[var(--primary)]">{product.name}</p>
                <p className="text-sm font-semibold text-[var(--accent)] mt-0.5">
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
