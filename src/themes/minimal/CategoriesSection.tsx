import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import { getCategoriesWithCount } from "@/lib/db/queries";
import type { CategoriesSectionProps } from "@/lib/types/sections";

type Props = CategoriesSectionProps & {
  shopId?: string;
  shopSlug?: string;
  shopBase?: string;
  themeConfig: ThemeConfig;
};

const COL_CLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
  6: "grid-cols-3 sm:grid-cols-6",
};

const CategoriesSection = async ({
  categoryIds = [],
  shopId,
  shopSlug,
  shopBase,
  themeConfig,
  columns = 3,
  variant = "grid",
  title,
}: Props) => {
  if (!shopId || !shopSlug) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const result = await getCategoriesWithCount(shopId);
  if (!result.ok) return null;

  const categories = categoryIds.length
    ? result.data.data.filter((c) => categoryIds.includes(c.id))
    : result.data.data;

  if (!categories.length) return null;

  // PILLS: clean border pills, no images
  if (variant === "pills") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-8">{title}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="border border-neutral-200 px-5 py-2 text-xs font-medium tracking-wide uppercase text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LARGE: image with overlay
  if (variant === "large") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-8">{title}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-neutral-100">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="group relative overflow-hidden bg-neutral-50"
                style={{ aspectRatio: "4/3" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // GRID (default): image card, category name below in small caps
  const colsCls = COL_CLS[columns] ?? COL_CLS[3];

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-8">{title}</p>
        )}
        <div className={`grid ${colsCls} gap-4`}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${base}/collections/${cat.slug}`}
              className="group block"
            >
              <div
                className="relative w-full overflow-hidden bg-neutral-50"
                style={{ aspectRatio: "1/1" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:opacity-80 transition-opacity duration-200"
                  />
                )}
              </div>
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-700">
                  {cat.name}
                </p>
                {cat._count.products > 0 && (
                  <p className="text-xs text-neutral-400 mt-0.5">{cat._count.products} products</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
