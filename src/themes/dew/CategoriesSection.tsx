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
    ? result.data.filter((c) => categoryIds.includes(c.id))
    : result.data;

  if (!categories.length) return null;

  // PILLS: fully-rounded pill buttons with accent bg on hover
  if (variant === "pills") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.sectionHeading} text-2xl mb-8`}>{title}</h2>
          )}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="border border-[var(--subtle)] px-5 py-2.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-colors"
                style={{ borderRadius: "999px" }}
              >
                {cat.name}
                {cat._count.products > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">({cat._count.products})</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LARGE: rounded cards with image
  if (variant === "large") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.sectionHeading} text-2xl mb-8`}>{title}</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="group relative overflow-hidden bg-[var(--surface)] shadow-sm hover:shadow-md transition-shadow"
                style={{ aspectRatio: "16/9", borderRadius: "var(--radius)" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  {cat._count.products > 0 && (
                    <p className="text-xs text-white/70 mt-0.5">{cat._count.products} products</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // GRID (default): rounded category cards, name text below image
  const colsCls = COL_CLS[columns] ?? COL_CLS[3];

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <h2 className={`${themeConfig.type.sectionHeading} text-2xl mb-8`}>{title}</h2>
        )}
        <div className={`grid ${colsCls} gap-4`}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${base}/collections/${cat.slug}`}
              className="group block bg-[var(--surface)] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              style={{ borderRadius: "var(--radius)" }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "1/1" }}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--subtle)]" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-[var(--primary)]">{cat.name}</p>
                {cat._count.products > 0 && (
                  <p className="text-xs text-[var(--muted)] mt-0.5">{cat._count.products} products</p>
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
