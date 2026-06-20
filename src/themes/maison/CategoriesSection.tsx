import Image from "next/image";
import Link from "next/link";
import { getCategoriesWithCount } from "@/lib/db/queries";
import { CategoriesSectionProps } from "@/lib/types/sections";

type Props = CategoriesSectionProps & { shopId?: string; shopSlug?: string };

const CategoriesSection = async ({ categoryIds = [], shopId, shopSlug }: Props) => {
  if (!shopId || !shopSlug || !categoryIds.length) return null;

  const result = await getCategoriesWithCount(shopId);
  if (!result.ok) return null;

  const categories = result.data.filter((c) => categoryIds.includes(c.id));
  if (!categories.length) return null;

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${shopSlug}/collections/${cat.slug}`}
              className="group relative overflow-hidden bg-[#E2DDD5]"
              style={{ aspectRatio: "3/4" }}
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
                <p className="font-display text-xl font-light text-white leading-tight">{cat.name}</p>
                {cat._count.products > 0 && (
                  <p className="text-[11px] tracking-[0.1em] text-white/65 mt-1">
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
};

export default CategoriesSection;
