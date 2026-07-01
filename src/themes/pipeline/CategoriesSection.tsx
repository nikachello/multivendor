import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import { getCategoriesByShop } from "@/lib/db/queries";
import type { CategoriesSectionProps } from "@/lib/types/sections";

type Props = CategoriesSectionProps & {
  shopId?: string;
  shopBase?: string;
  shopSlug?: string;
  themeConfig: ThemeConfig;
};

const CategoriesSection = async ({
  shopId,
  shopBase,
  shopSlug = "",
  categoryIds = [],
  columns = 4,
  title,
  variant = "grid",
  themeConfig,
}: Props) => {
  if (!shopId) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const result = await getCategoriesByShop(shopId);
  if (!result.ok) return null;

  const allCategories = result.data;
  const categories =
    categoryIds.length > 0
      ? categoryIds.map((id) => allCategories.find((c) => c.id === id)).filter(Boolean)
      : allCategories;

  if (!categories.length) return null;

  const colMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-6",
  };

  // PILLS variant
  if (variant === "pills") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={themeConfig.layout.contentPx}>
          {title && (
            <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 mb-8">{title}</p>
          )}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => {
              if (!cat) return null;
              return (
                <Link
                  key={cat.id}
                  href={`${base}/collections/${cat.slug}`}
                  className="border border-neutral-200 text-neutral-700 text-[11px] font-semibold tracking-[0.12em] uppercase px-6 py-3 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 mb-10">{title}</p>
        )}
        <div className={`grid ${colMap[columns] ?? "grid-cols-2 md:grid-cols-4"} gap-3 md:gap-5`}>
          {categories.map((cat) => {
            if (!cat) return null;
            return (
              <Link key={cat.id} href={`${base}/collections/${cat.slug}`} className="group block">
                <div
                  className="relative w-full overflow-hidden bg-neutral-50"
                  style={{ aspectRatio: themeConfig.sections.categories.aspectRatio }}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                  {/* Subtle bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-[11px] font-semibold tracking-[0.15em] uppercase text-white">
                    {cat.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
