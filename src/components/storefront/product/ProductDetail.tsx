"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/data-types";

type Props = {
  product: Product;
  currency: string;
  shopSlug: string;
  shopName: string;
};

export default function ProductDetail({
  product,
  currency,
  shopSlug,
  shopName,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => product.variants[0]?.options ?? {});
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Collect unique values per option key across all variants
  const optionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const variant of product.variants) {
      for (const [key, value] of Object.entries(variant.options)) {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(value)) groups[key].push(value);
      }
    }
    return groups;
  }, [product.variants]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((v) =>
        Object.entries(selectedOptions).every(([k, val]) => v.options[k] === val)
      ) ?? product.variants[0],
    [product.variants, selectedOptions]
  );

  const images = product.images.length > 0 ? product.images : [];
  const mainImageSrc = selectedVariant?.image ?? images[activeImage] ?? null;

  function selectOption(key: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  }

  function handleImgError(index: number | "main") {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }

  const inStock = (selectedVariant?.stock ?? 0) > 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link href={`/shop/${shopSlug}`} className="hover:text-neutral-600 transition-colors">
          {shopName}
        </Link>
        <span>/</span>
        <span className="text-neutral-600 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        {/* ── Image gallery ── */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            {mainImageSrc && !imgErrors["main"] ? (
              <Image
                src={mainImageSrc}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
                onError={() => handleImgError("main")}
                priority
              />
            ) : (
              <PlaceholderIcon />
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square bg-neutral-100 overflow-hidden transition-opacity ${
                    activeImage === i
                      ? "ring-2 ring-black ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {!imgErrors[i] ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => handleImgError(i)}
                    />
                  ) : (
                    <PlaceholderIcon small />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
            {product.name}
          </h1>

          <p className="mt-3 text-xl font-medium text-neutral-900">
            {currency} {selectedVariant?.price ?? product.priceFrom}
          </p>

          {selectedVariant && (
            <p className="mt-1 text-sm text-neutral-400">
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : "Out of stock"}
            </p>
          )}

          {/* Variant options */}
          {Object.entries(optionGroups).map(([key, values]) => (
            <div key={key} className="mt-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
                {key}
              </p>
              <div className="flex flex-wrap gap-2">
                {values.map((val) => {
                  const active = selectedOptions[key] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => selectOption(key, val)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-500"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Quantity
            </p>
            <div className="inline-flex items-center border border-neutral-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg text-neutral-500 hover:text-black transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.min(selectedVariant?.stock ?? 99, q + 1)
                  )
                }
                className="w-10 h-10 flex items-center justify-center text-lg text-neutral-500 hover:text-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            disabled={!inStock}
            className="mt-6 w-full py-4 text-sm tracking-widest uppercase bg-[#C25447] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
                Description
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* SKU */}
          {selectedVariant?.sku && (
            <p className="mt-6 text-xs text-neutral-300 font-mono">
              SKU: {selectedVariant.sku}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceholderIcon({ small }: { small?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        className={`${small ? "w-6 h-6" : "w-12 h-12"} text-neutral-300`}
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
  );
}
