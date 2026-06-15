import Link from "next/link";
import { Category } from "@/generated/prisma/client";
import CategoryImage from "./CategoryImage";

type Props = {
  title?: string;
  categories: Category[];
  shopSlug: string;
};

export default function CategoriesLarge({ title, categories, shopSlug }: Props) {
  return (
    <div className="py-10">
      {title && (
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/${shopSlug}/collections/${category.slug}`}
            className="relative h-[220px] overflow-hidden bg-neutral-100 group block"
            style={{ borderRadius: "calc(var(--radius) * 2)" }}
          >
            <CategoryImage category={category} />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-semibold tracking-tight">{category.name}</h3>
              {category.description && (
                <p className="mt-2 text-sm text-white/80 max-w-xs text-center">{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
