"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CollectionProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  inStock: boolean;
};

type SortOption = "all" | "price-asc" | "price-desc" | "in-stock";

type Props = {
  categoryName: string;
  products: CollectionProduct[];
  shopBase: string;
  currency: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "all", label: "All" },
  { key: "price-asc", label: "Price: low–high" },
  { key: "price-desc", label: "Price: high–low" },
  { key: "in-stock", label: "In stock" },
];

export default function CreatorCollectionPage({
  categoryName,
  products,
  shopBase,
  currency,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}: Props) {
  const router = useRouter();
  const [sort, setSort] = useState<SortOption>("all");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "in-stock": return list.filter((p) => p.inStock);
      default: return list;
    }
  }, [products, sort]);

  return (
    <div className="max-w-[560px] mx-auto bg-[var(--page-bg)]" style={{ fontFamily: "var(--creator-body-font)" }}>

      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex items-center gap-1.5 text-sm text-[var(--creator-muted)] hover:text-[var(--creator-on-surface)] transition-colors mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <h1
          className="text-2xl text-[var(--creator-on-surface)]"
          style={{ fontFamily: "var(--creator-display-font)" }}
        >
          {categoryName}
        </h1>
        <p className="text-sm text-[var(--creator-muted)] mt-0.5">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Sort bar */}
      <div className="px-5 pb-4 flex flex-nowrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={[
              "flex-shrink-0 rounded-xl px-4 py-2 text-sm whitespace-nowrap transition-colors",
              sort === opt.key
                ? "bg-[var(--primary)] text-white ring-1 ring-[var(--primary)]"
                : "bg-transparent text-[var(--creator-on-surface)] ring-1 ring-[var(--creator-subtle)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {sortedProducts.map((product) => (
          <Link key={product.id} href={`${shopBase}/product/${product.slug}`} className="block">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--creator-subtle)]">
              {product.image && (
                <Image src={product.image} alt={product.name} fill sizes="280px" className="object-cover" />
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                  <span className="text-xs font-semibold text-white bg-black/50 rounded-full px-2 py-0.5">
                    Sold out
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium mt-2 leading-snug line-clamp-2 text-[var(--creator-on-surface)]">
              {product.name}
            </p>
            <p className="text-sm font-bold mt-0.5 tabular-nums text-[var(--creator-on-surface)]">
              {product.price.toFixed(2)} {currency}
            </p>
          </Link>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-6 mb-10">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="h-12 rounded-2xl ring-1 ring-[var(--creator-subtle)] px-8 text-sm font-semibold text-[var(--creator-on-surface)] bg-transparent disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
      {!hasMore && <div className="pb-10" />}
    </div>
  );
}
