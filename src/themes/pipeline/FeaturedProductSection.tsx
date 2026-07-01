import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import { getCategoriesByShop, getProductsByCategory } from "@/lib/db/queries";

type Props = {
  categoryId?: string;
  shopId?: string;
  shopSlug?: string;
  shopBase?: string;
  currency?: string;
  themeConfig: ThemeConfig;
  overlineText?: string;
  buttonText?: string;
};

const FeaturedProductSection = async ({
  categoryId,
  shopId,
  shopSlug,
  shopBase,
  currency,
  themeConfig,
  overlineText = "Featured",
  buttonText = "Shop Now",
}: Props) => {
  if (!shopId || !shopSlug || !currency || !categoryId) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const categoriesResult = await getCategoriesByShop(shopId);
  if (!categoriesResult.ok) return null;
  const category = categoriesResult.data.find((c) => c.id === categoryId);
  if (!category) return null;

  const productsResult = await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;
  const product = productsResult.data[0];
  if (!product) return null;

  const mainImage = product.images.find((img) => img.isMain) ?? product.images[0];
  const secondImage = product.images.find((img) => !img.isMain && img !== mainImage);
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center`}>
        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative w-full overflow-hidden bg-neutral-50" style={{ aspectRatio: "4/5" }}>
            {mainImage ? (
              <Image src={mainImage.url} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-neutral-100" />
            )}
          </div>
          <div className="relative w-full overflow-hidden bg-neutral-50 mt-10" style={{ aspectRatio: "4/5" }}>
            {secondImage ? (
              <Image src={secondImage.url} alt={product.name} fill className="object-cover" unoptimized />
            ) : mainImage ? (
              <Image src={mainImage.url} alt={product.name} fill className="object-cover opacity-60" unoptimized />
            ) : (
              <div className="w-full h-full bg-neutral-50" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 md:mt-0">
          {overlineText && (
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 mb-4">
              {overlineText}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight text-neutral-900">
            {product.name}
          </h2>
          {product.description && (
            <p className="mt-5 text-sm text-neutral-500 leading-relaxed max-w-sm">
              {product.description}
            </p>
          )}
          <p className="mt-5 text-xl font-semibold text-neutral-900 tracking-tight">
            {currency} {minPrice.toFixed(2)}
          </p>
          <Link
            href={`${base}/product/${product.slug}`}
            className="mt-8 inline-block border border-neutral-900 text-neutral-900 text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductSection;
