"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ProductImage = { url: string; isMain: boolean };

export type PipelineProduct = {
  id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  minPrice: number;
  isNew?: boolean;
};

type Props = {
  products: PipelineProduct[];
  base: string;
  currency: string;
  showVendor?: boolean;
  columns?: 2 | 3 | 4;
};

const colClass: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

function ProductCard({ product, base, currency }: { product: PipelineProduct; base: string; currency: string }) {
  const [hovered, setHovered] = useState(false);

  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0];
  const hoverImage = product.images.find((i) => !i.isMain && i !== mainImage) ?? null;
  const showRollover = hoverImage && hovered;

  return (
    <Link
      href={`${base}/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container — portrait 4/5 */}
      <div className="relative w-full overflow-hidden bg-neutral-50" style={{ aspectRatio: "4/5" }}>
        {/* Main image */}
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${showRollover ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"}`}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}

        {/* Hover / rollover image */}
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={product.name}
            fill
            className={`object-cover absolute inset-0 transition-all duration-500 ${showRollover ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"}`}
            unoptimized
          />
        )}

        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-neutral-900 text-white text-[9px] font-semibold tracking-[0.15em] uppercase px-2 py-1">
              New
            </span>
          </div>
        )}
      </div>

      {/* Product info — no chrome */}
      <div className="mt-3.5 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-neutral-900 leading-snug">{product.name}</p>
        <span className="text-sm text-neutral-500 shrink-0">
          {currency} {product.minPrice.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}

export default function PipelineProductGrid({ products, base, currency, columns = 4 }: Props) {
  return (
    <div className={`grid ${colClass[columns] ?? "grid-cols-2 md:grid-cols-4"} gap-x-4 gap-y-10`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} base={base} currency={currency} />
      ))}
    </div>
  );
}
