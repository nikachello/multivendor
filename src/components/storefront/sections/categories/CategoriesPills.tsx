import Link from "next/link";
import { Category } from "@/generated/prisma/client";

type Props = {
  title?: string;
  categories: Category[];
  shopSlug: string;
};

export default function CategoriesPills({ title, categories, shopSlug }: Props) {
  return (
    <div className="py-10">
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        </div>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/${shopSlug}/collections/${category.slug}`}
            className="px-6 py-2.5 border border-neutral-300 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
