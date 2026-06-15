"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithRelations } from "@/lib/db/queries";

type Props = {
  product: ProductWithRelations;
  currency: string;
  shopSlug: string;
};

const CollectionItem = ({ product, currency, shopSlug }: Props) => {
  const [imgError, setImgError] = useState(false);
  const mainImage = product.images[0].url;
  const hasImage = !!mainImage && !imgError;

  const lowestPrice = product.variants.length
    ? Math.min(...product.variants.map((v) => Number(v.price)))
    : 0;
  const hasMultipleVariantPrices = product.variants.some(
    (v) => Number(v.price) !== lowestPrice,
  );
  const isSoldOut =
    product.variants.length === 0 ||
    product.variants.every((v) => v.stock === 0);

  return (
    <Link
      href={`/shop/${shopSlug}/product/${product.slug}`}
      className="group block"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100" style={{ borderRadius: "calc(var(--radius) * 2)" }}>
        {hasImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Sold out pill */}
        {isSoldOut && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] tracking-widest uppercase bg-neutral-800 text-white px-2 py-1">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover overlay */}
        {!isSoldOut && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 px-4 py-2">
              View
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {product.name}
        </p>
        <p
          className={`text-sm ${isSoldOut ? "text-neutral-300 line-through" : "text-neutral-500"}`}
        >
          {hasMultipleVariantPrices ? "From " : ""}
          {currency} {lowestPrice.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CollectionItem;
