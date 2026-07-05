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

  // PILLS: elegant border pills with wide tracking
  if (variant === "pills") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)] mb-10`}>
              {title}
            </h2>
          )}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="border border-[var(--subtle)] px-7 py-2.5 text-[11px] tracking-[0.15em] uppercase text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // LARGE: full-bleed images with gradient overlay from bottom, display font
  if (variant === "large") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)] mb-10`}>
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${base}/collections/${cat.slug}`}
                className="group relative overflow-hidden bg-[var(--surface)]"
                style={{ aspectRatio: "3/4" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className={`${themeConfig.type.displayFont} font-light text-white text-2xl leading-tight`}>
                    {cat.name}
                  </p>
                  {cat._count.products > 0 && (
                    <p className="text-[10px] tracking-[0.15em] uppercase text-white/60 mt-2">
                      {cat._count.products} {cat._count.products === 1 ? "piece" : "pieces"}
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

  // GRID (default): full-bleed gradient overlay, display font name
  const colsCls = COL_CLS[columns] ?? COL_CLS[3];

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)] mb-10`}>
            {title}
          </h2>
        )}
        <div className={`grid ${colsCls} gap-4`}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${base}/collections/${cat.slug}`}
              className="group relative overflow-hidden bg-[var(--surface)]"
              style={{ aspectRatio: themeConfig.sections.categories.aspectRatio }}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className={`${themeConfig.type.displayFont} font-light text-white text-xl leading-tight`}>
                  {cat.name}
                </p>
                {cat._count.products > 0 && (
                  <p className="text-[10px] tracking-[0.12em] uppercase text-white/55 mt-1.5">
                    {cat._count.products} {cat._count.products === 1 ? "piece" : "pieces"}
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
