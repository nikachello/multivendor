"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { ProductWithRelations } from "@/lib/db/queries";
import { trackViewContent, trackAddToCart } from "@/lib/tracking";
import { recordEvent } from "@/lib/actions/analytics";
import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { useT } from "@/i18n/context";

type Props = {
  product: ProductWithRelations;
  currency: string;
  shopSlug: string;
  shopBase?: string;
  shopName: string;
  shopId: string;
};

export default function ProductDetail({
  product,
  currency,
  shopSlug,
  shopBase,
  shopName,
  shopId,
}: Props) {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => product.variants[0] ? getVariantOptions(product.variants[0]) : {});
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState(false);

  const { add } = useCart(shopId);
  const sessionId = useAnalyticsSession();
  const t = useT();

  useEffect(() => {
    if (sessionId) recordEvent(shopId, "view", sessionId, product.id);
    trackViewContent(
      { id: product.id, name: product.name, price: Number(product.priceFrom) },
      currency,
    );
  // sessionId/shopId intentionally excluded — this should fire once per product view,
  // not re-fire if the analytics session resolves after mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, product.name, product.priceFrom, currency]);

  function getVariantOptions(
    variants: ProductWithRelations["variants"][number],
  ): Record<string, string> {
    return Object.fromEntries(
      variants.optionValues.map((ov) => [
        ov.optionValue.optionType.name,
        ov.optionValue.value,
      ]),
    );
  }

  // Collect unique values per option key across all variants
  const optionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const variant of product.variants) {
      for (const [key, value] of Object.entries(getVariantOptions(variant))) {
        if (!groups[key]) groups[key] = [];
        if (!groups[key].includes(value)) groups[key].push(value);
      }
    }
    return groups;
  }, [product.variants]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find((v) => {
        const opts = getVariantOptions(v);
        return Object.entries(selectedOptions).every(
          ([k, val]) => opts[k] === val,
        );
      }) ?? product.variants[0],
    [product.variants, selectedOptions],
  );

  const images = product.images.length > 0 ? product.images : [];
  const mainImageSrc =
    selectedVariant?.image ?? images[activeImage]?.url ?? null;

  function selectOption(key: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  }

  function handleImgError(index: number | "main") {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }

  const tracksInventory = (selectedVariant as { trackInventory?: boolean } | undefined)?.trackInventory ?? true;
  const inStock = !selectedVariant ? false : (!tracksInventory || selectedVariant.stock > 0);

  function handleAddToCart() {
    if (!selectedVariant || !inStock) return;
    add({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantOptions: getVariantOptions(selectedVariant),
      price: Number(selectedVariant.price),
      quantity,
      image: selectedVariant.image ?? product.images[0]?.url ?? null,
    });
    trackAddToCart(
      { id: product.id, name: product.name, price: Number(selectedVariant.price), quantity },
      currency,
    );
    if (sessionId) recordEvent(shopId, "add_to_cart", sessionId, product.id, Number(selectedVariant.price) * quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link
          href={base || "/"}
          className="hover:text-neutral-600 transition-colors"
        >
          {shopName}
        </Link>
        <span>/</span>
        <span className="text-neutral-600 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
        {/* ── Image gallery ── */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden" style={{ borderRadius: "calc(var(--radius) * 2)" }}>
            {mainImageSrc && !imgErrors["main"] ? (
              <Image
                src={mainImageSrc}
                alt={product.name}
                fill
                className="object-cover"
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
                  aria-label={t("storefront.product.view_image", { n: i + 1 })}
                  aria-current={activeImage === i}
                  className={`relative aspect-square bg-neutral-100 overflow-hidden transition-opacity ${
                    activeImage === i
                      ? "ring-2 ring-black ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {!imgErrors[i] ? (
                    <Image
                      src={src.url}
                      alt=""
                      fill
                      className="object-cover"
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
            {currency} {Number(selectedVariant?.price ?? product.priceFrom)}
          </p>

          {selectedVariant && (
            <p className="mt-1 text-sm text-neutral-400">
              {!tracksInventory
                ? t("storefront.product.in_stock")
                : selectedVariant.stock > 0
                  ? `${selectedVariant.stock} ${t("storefront.product.in_stock")}`
                  : t("storefront.product.out_of_stock")}
            </p>
          )}

          {/* Variant options */}
          {Object.entries(optionGroups).map(([key, values]) => (
            <div key={key} className="mt-6">
              <p id={`option-label-${key}`} className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
                {key}
              </p>
              <div role="radiogroup" aria-labelledby={`option-label-${key}`} className="flex flex-wrap gap-2">
                {values.map((val) => {
                  const active = selectedOptions[key] === val;
                  return (
                    <button
                      key={val}
                      role="radio"
                      aria-checked={active}
                      onClick={() => selectOption(key, val)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        active
                          ? "border-transparent text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-500"
                      }`}
                      style={active ? { backgroundColor: "var(--primary)", color: "var(--secondary)", borderRadius: "var(--radius)" } : { borderRadius: "var(--radius)" }}
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
              {t("storefront.product.quantity")}
            </p>
            <div className="inline-flex items-center border border-neutral-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={t("storefront.product.decrease_qty")}
                className="w-10 h-10 flex items-center justify-center text-lg text-neutral-500 hover:text-black transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) =>
                    tracksInventory
                      ? Math.min(selectedVariant?.stock ?? 99, q + 1)
                      : q + 1,
                  )
                }
                aria-label={t("storefront.product.increase_qty")}
                className="w-10 h-10 flex items-center justify-center text-lg text-neutral-500 hover:text-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            disabled={!inStock || added}
            onClick={handleAddToCart}
            className="mt-6 w-full py-4 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--primary)", color: "var(--secondary)", borderRadius: "var(--radius)" }}
          >
            {!inStock ? t("storefront.product.out_of_stock") : added ? t("storefront.product.added") : t("storefront.product.add_to_cart")}
          </button>

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-neutral-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
                {t("storefront.product.description")}
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
