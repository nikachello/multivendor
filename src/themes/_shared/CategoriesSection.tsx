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

const CategoriesSection = async ({ categoryIds = [], shopId, shopSlug, shopBase, themeConfig }: Props) => {
  if (!shopId || !shopSlug || !categoryIds.length) return null;
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const result = await getCategoriesWithCount(shopId);
  if (!result.ok) return null;

  const categories = result.data.filter((c) => categoryIds.includes(c.id));
  if (!categories.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
