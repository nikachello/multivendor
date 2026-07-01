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

  // Pills variant: horizontal scrolling row of pill buttons
  if (variant === "pills") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.sectionHeading} mb-8`}>{title}</h2>
          )}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="border border-[var(--subtle)] px-5 py-2.5 text-sm hover:bg-[var(--primary)] hover:text-[var(--secondary)] hover:border-[var(--primary)] transition-colors"
                style={{ borderRadius: "var(--radius)" }}
              >
                {cat.name}
                {cat._count.products > 0 && (
                  <span className="ml-1.5 text-xs opacity-50">({cat._count.products})</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Large variant: 2-column, taller cards
  if (variant === "large") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.sectionHeading} mb-8`}>{title}</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className={`group relative overflow-hidden ${themeConfig.components.productImage.bg}`}
                style={{ aspectRatio: "16/9" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className={`${themeConfig.type.displayFont} text-2xl font-light text-white leading-tight`}>
                    {cat.name}
                  </p>
                  {cat._count.products > 0 && (
                    <p className="text-[11px] tracking-[0.1em] text-white/65 mt-1.5">
                      {cat._count.products} {cat._count.products === 1 ? "product" : "products"}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Grid variant (default)
  const colsCls = COL_CLS[columns] ?? COL_CLS[3];

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <h2 className={`${themeConfig.type.sectionHeading} mb-8`}>{title}</h2>
        )}
        <div className={`grid ${colsCls} gap-3`}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${base}/collections/${cat.slug}`}
              className={`group relative overflow-hidden ${themeConfig.components.productImage.bg}`}
              style={{ aspectRatio: themeConfig.sections.categories.aspectRatio }}
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
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className={`${themeConfig.type.displayFont} text-xl font-light text-white leading-tight`}>
                  {cat.name}
                </p>
                {cat._count.products > 0 && (
                  <p className="text-[11px] tracking-[0.1em] text-white/65 mt-1">
                    {cat._count.products}{" "}
                    {cat._count.products === 1 ? "product" : "products"}
                  </p>
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
