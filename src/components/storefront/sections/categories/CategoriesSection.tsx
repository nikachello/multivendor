"use client";

import Link from "next/link";
import Image from "next/image";

import { CategoriesSectionProps } from "@/lib/types/sections";
import { getCategoriesByShop } from "@/lib/data/queries";

export default function CategoriesSection({
  title = "Shop by Category",
  categoryIds,
  columns = 4,
  showProductCount = false,
  shopId,
}: CategoriesSectionProps & { shopId?: string }) {
  if (!shopId) return null;

  const allCategories = getCategoriesByShop(shopId);

  const categories = categoryIds?.length
    ? allCategories.filter((c) => categoryIds.includes(c.id))
    : allCategories;

  if (categories.length === 0) {
    return (
      <div className="px-5 md:px-10 py-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>

          <p className="mt-4 text-sm text-neutral-500">
            კატეგორიები არ მოიძებნა
          </p>
        </div>
      </div>
    );
  }

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <div className="px-5 md:px-10 py-10">
      {/* TITLE (same as CollectionContainer) */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h2>
      </div>

      {/* GRID */}
      <div className={`grid gap-4 md:gap-6 ${gridCols[columns]}`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.slug}`}
            className="block"
          >
            {/* IMAGE (NO radius, NO hover) */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                  No image
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="mt-3 text-center">
              <h3 className="font-medium">{category.name}</h3>

              {showProductCount && (
                <p className="mt-1 text-sm text-neutral-500">0 products</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
