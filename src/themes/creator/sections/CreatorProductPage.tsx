"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/lib/store/cart-store";

type ProductOptionValue = {
  name: string;
  value: string;
};

type ProductVariant = {
  id: string;
  price: number;
  stock: number;
  trackInventory: boolean;
  optionValues: ProductOptionValue[];
  image?: string;
};

type ProductData = {
  id: string;
  name: string;
  description?: string;
  images: string[];
  priceFrom: number;
  badge?: string;
  variants: ProductVariant[];
};

type Props = {
  product: ProductData;
  shopId: string;
  shopBase: string;
  currency: string;
  ctaLabel?: string;
  showQuantity?: boolean;
  showShipping?: boolean;
  shippingNote?: string;
};

type CtaState = "idle" | "adding" | "added";

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8h11v8H2z" />
      <path d="M13 11h4l3 3v2h-7z" />
      <circle cx="6.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </svg>
  );
}

function isColorOption(name: string) {
  return name.trim().toLowerCase() === "color";
}

export default function CreatorProductPage({
  product,
  shopId,
  currency,
  ctaLabel = "Add to cart",
  showQuantity = true,
  showShipping = true,
  shippingNote = "Free shipping over 50 GEL",
}: Props) {
  const { add } = useCart(shopId);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const optionTypes = useMemo(() => {
    const seen: string[] = [];
    for (const v of product.variants) {
      for (const ov of v.optionValues) {
        if (!seen.includes(ov.name)) seen.push(ov.name);
      }
    }
    return seen;
  }, [product.variants]);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    const first = product.variants[0];
    if (first) {
      for (const ov of first.optionValues) initial[ov.name] = ov.value;
    }
    return initial;
  });

  const selectedVariant = useMemo(
    () =>
      product.variants.find((v) =>
        v.optionValues.every((ov) => selected[ov.name] === ov.value)
      ),
    [product.variants, selected]
  );

  const isSoldOut =
    !selectedVariant ||
    (selectedVariant.trackInventory && selectedVariant.stock <= 0);

  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [ctaState, setCtaState] = useState<CtaState>("idle");
  const [imageIndex, setImageIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const price = selectedVariant?.price ?? product.priceFrom;

  function valuesForOption(optionName: string) {
    const values: { value: string; available: boolean }[] = [];
    const seen = new Set<string>();
    for (const v of product.variants) {
      const ov = v.optionValues.find((o) => o.name === optionName);
      if (!ov || seen.has(ov.value)) continue;
      seen.add(ov.value);
      const candidateSelection = { ...selected, [optionName]: ov.value };
      const matches = product.variants.filter((mv) =>
        mv.optionValues.every((mov) => candidateSelection[mov.name] === mov.value)
      );
      const available = matches.some((m) => !m.trackInventory || m.stock > 0);
      values.push({ value: ov.value, available });
    }
    return values;
  }

  function scrollToImage(i: number) {
    setImageIndex(i);
    scrollerRef.current?.scrollTo({ left: i * (scrollerRef.current.clientWidth), behavior: "smooth" });
  }

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== imageIndex) setImageIndex(i);
  }

  async function handleAdd() {
    if (isSoldOut || !selectedVariant || ctaState !== "idle") return;
    setCtaState("adding");
    const variantOptions: Record<string, string> = {};
    for (const ov of selectedVariant.optionValues) {
      variantOptions[ov.name] = ov.value;
    }
    add({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantOptions,
      price: selectedVariant.price,
      quantity,
      image: selectedVariant.image ?? product.images[0],
    });
    setCtaState("added");
    setCartOpen(true);
    setTimeout(() => setCtaState("idle"), 2000);
  }

  const ctaText =
    isSoldOut ? "Sold out"
    : ctaState === "adding" ? "Adding…"
    : ctaState === "added" ? "✓ Added"
    : ctaLabel;

  return (
    <div className="max-w-[560px] mx-auto bg-[var(--page-bg)]" style={{ fontFamily: "var(--creator-body-font)" }}>

      {/* 1. Image gallery */}
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {product.images.length > 0 ? product.images.map((src, i) => (
            <div key={i} className="relative w-full flex-shrink-0 snap-center aspect-[4/5]">
              <Image src={src} alt={`${product.name} — ${i + 1}`} fill sizes="560px" className="object-cover" priority={i === 0} />
            </div>
          )) : (
            <div className="w-full aspect-[4/5] bg-[var(--creator-subtle)]" />
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                aria-label={`Image ${i + 1}`}
                onClick={() => scrollToImage(i)}
                className={
                  i === imageIndex
                    ? "h-1.5 w-5 rounded-full bg-[var(--primary)] transition-all"
                    : "h-1.5 w-1.5 rounded-full bg-[var(--creator-subtle)] transition-all"
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Header */}
      <div className="px-5 pt-4">
        {product.badge && (
          <span className="inline-block rounded-full px-3 py-0.5 text-xs font-semibold bg-[var(--creator-subtle)] text-[var(--creator-muted)]">
            {product.badge}
          </span>
        )}
        <h1
          className="text-2xl font-normal leading-tight text-[var(--creator-on-surface)] mt-1.5"
          style={{ fontFamily: "var(--creator-display-font)" }}
        >
          {product.name}
        </h1>
        <p className="text-xl font-bold text-[var(--creator-on-surface)] tabular-nums mt-1">
          {price.toFixed(2)} {currency}
        </p>
      </div>

      {/* 3. Description */}
      {product.description && (
        <div className="px-5 mt-3">
          <p className={`text-sm text-[var(--creator-muted)] leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
            {product.description}
          </p>
          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="text-sm text-[var(--creator-muted)] underline underline-offset-2 hover:opacity-80 mt-1"
            >
              Read more
            </button>
          )}
        </div>
      )}

      {/* 4. Variant pickers */}
      {optionTypes.map((optionName) => (
        <div key={optionName} className="px-5 mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--creator-muted)] mb-2">
            {optionName}
          </div>
          <div className="flex flex-nowrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {valuesForOption(optionName).map(({ value, available }) => {
              const isSelected = selected[optionName] === value;
              if (isColorOption(optionName)) {
                return (
                  <button
                    key={value}
                    disabled={!available}
                    onClick={() => setSelected((s) => ({ ...s, [optionName]: value }))}
                    aria-label={value}
                    className={[
                      "w-7 h-7 rounded-full flex-shrink-0 ring-1 ring-[var(--creator-subtle)]",
                      isSelected ? "ring-2 ring-offset-2 ring-[var(--primary)]" : "",
                      !available ? "opacity-40 pointer-events-none" : "",
                    ].join(" ")}
                    style={{ backgroundColor: value }}
                  />
                );
              }
              return (
                <button
                  key={value}
                  disabled={!available}
                  onClick={() => setSelected((s) => ({ ...s, [optionName]: value }))}
                  className={[
                    "flex-shrink-0 rounded-xl px-4 py-2 text-sm transition-colors",
                    isSelected
                      ? "bg-[var(--primary)] text-white ring-1 ring-[var(--primary)]"
                      : "bg-transparent text-[var(--creator-on-surface)] ring-1 ring-[var(--creator-subtle)]",
                    !available ? "opacity-40 line-through pointer-events-none" : "",
                  ].join(" ")}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 5. Quantity stepper */}
      {showQuantity && (
        <div className="px-5 mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--creator-on-surface)]">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl ring-1 ring-[var(--creator-subtle)] flex items-center justify-center text-[var(--creator-on-surface)]"
              aria-label="Decrease"
            >
              <MinusIcon />
            </button>
            <span className="w-10 text-center font-semibold tabular-nums text-[var(--creator-on-surface)]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-xl ring-1 ring-[var(--creator-subtle)] flex items-center justify-center text-[var(--creator-on-surface)]"
              aria-label="Increase"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      )}

      {/* 6. Shipping note */}
      {showShipping && (
        <div className="px-5 mt-3 flex items-center gap-2 text-xs text-[var(--creator-muted)]">
          <TruckIcon />
          <span>{shippingNote}</span>
        </div>
      )}

      {/* Spacer for sticky bar */}
      <div className="pb-32" />

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--creator-surface)] border-t border-[var(--creator-subtle)] px-5 py-4">
        <div className="max-w-[560px] mx-auto">
          <button
            onClick={handleAdd}
            disabled={isSoldOut || ctaState !== "idle"}
            className={[
              "w-full h-14 rounded-2xl font-semibold text-[15px] transition-all",
              isSoldOut
                ? "bg-[var(--creator-subtle)] text-[var(--creator-muted)] pointer-events-none"
                : ctaState === "added"
                ? "bg-[var(--creator-on-surface)] text-[var(--creator-surface)]"
                : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]" +
                  (ctaState === "adding" ? " opacity-70" : ""),
            ].join(" ")}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}
