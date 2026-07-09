"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

type Variant = { id: string; price: number; stock: number; trackInventory: boolean };

type Product = {
  id: string;
  name: string;
  slug: string;
  images: { url: string; isMain: boolean }[];
  variants: Variant[];
};

type Props = {
  product: Product;
  badge?: string;
  ctaLabel?: string;
  shopId?: string;
  shopBase?: string;
  currency?: string;
};

export default function CreatorFeaturedProductClient({
  product,
  badge,
  ctaLabel = "Add to cart",
  shopId = "",
  shopBase = "",
  currency = "USD",
}: Props) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { add } = useCart(shopId);

  const mainImage = product.images.find((i) => i.isMain) ?? product.images[0];
  const firstVariant = product.variants[0];
  const price = firstVariant?.price ?? 0;
  const inStock = firstVariant ? (!firstVariant.trackInventory || firstVariant.stock > 0) : false;

  async function handleAdd() {
    if (!firstVariant || !inStock || loading) return;
    setLoading(true);
    await add({
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      variantOptions: {},
      price,
      image: mainImage?.url ?? "",
      quantity: 1,
    });
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)]">
      <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--creator-subtle)]" />
        )}
        {badge && (
          <div className="absolute top-3 left-3 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {badge}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-[var(--creator-on-surface)]">{product.name}</h3>
        <p className="text-xl font-bold tabular-nums text-[var(--creator-on-surface)]">
          {currency} {price.toFixed(2)}
        </p>
        <button
          onClick={handleAdd}
          disabled={!inStock || loading}
          className="mt-2 h-12 rounded-xl text-white text-sm font-semibold flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50"
          style={{
            backgroundColor: added ? "var(--creator-on-surface)" : "var(--primary)",
          }}
        >
          {loading ? "Adding…" : added ? "✓ Added" : inStock ? ctaLabel : "Out of stock"}
        </button>
      </div>
    </div>
  );
}
