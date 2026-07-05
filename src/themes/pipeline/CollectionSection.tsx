import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import { getCategoryById, getProductsByCategory, getFeaturedProducts } from "@/lib/db/queries";
import PipelineProductGrid, { PipelineProduct } from "./PipelineProductGrid";

type Props = {
  categoryId: string;
  shopId?: string;
  shopSlug?: string;
  shopBase?: string;
  currency?: string;
  themeConfig: ThemeConfig;
  columns?: 2 | 3 | 4;
  showViewAll?: boolean;
  limit?: number;
};

const CollectionSection = async ({
  categoryId,
  shopId,
  shopSlug,
  shopBase,
  currency,
  themeConfig,
  columns = 4,
  showViewAll = true,
  limit,
}: Props) => {
  if (!shopId || !shopSlug || !currency || !categoryId) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const categoryResult = await getCategoryById(categoryId);
  if (!categoryResult.ok) return null;
  const category = categoryResult.data;

  const productsResult = limit
    ? await getFeaturedProducts(shopId, categoryId, limit)
    : await getProductsByCategory(shopId, categoryId);
  if (!productsResult.ok) return null;
  const raw = productsResult.data;

  const products: PipelineProduct[] = raw.map((p) => {
    const minPrice = Math.min(...p.variants.map((v) => v.price));
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      images: p.images,
      minPrice,
    };
  });

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      {/* Header */}
      <div className={`${themeConfig.layout.contentPx} flex items-baseline justify-between mb-10`}>
        <div>
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400">
            {category.name}
          </span>
        </div>
        {showViewAll && (
          <Link
            href={`${base}/collections/${category.slug}`}
            className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className={themeConfig.layout.contentPx}>
        <PipelineProductGrid
          products={products}
          base={base}
          currency={currency}
          columns={columns}
        />
      </div>
    </section>
  );
};

export default CollectionSection;
