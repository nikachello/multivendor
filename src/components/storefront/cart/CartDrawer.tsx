"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { useCart } from "@/hooks/useCart";
import { useT } from "@/i18n/context";

type Props = {
  shopId: string;
  shopSlug: string;
  shopBase?: string;
  currency: string;
};

export default function CartDrawer({ shopId, shopSlug, shopBase, currency }: Props) {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  const t = useT();
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { cart, remove, setQuantity } = useCart(shopId);

  const items = cart?.items ?? [];

  useEffect(() => {
    if (!cartOpen) return;
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCartOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [cartOpen, setCartOpen]);

  return (
    <>
      {/* Backdrop — always in DOM so opacity can transition with the drawer */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          cartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!cartOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
          <h2 id={titleId} className="text-sm font-semibold tracking-widest uppercase">
            {t("cart.title")}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={() => setCartOpen(false)}
            className="text-neutral-400 hover:text-black transition-colors"
            aria-label={t("cart.close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-400">
              <svg
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <p className="text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <svg
                          className="w-5 h-5"
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
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {item.productName}
                    </p>
                    {Object.values(item.variantOptions).length > 0 && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {Object.values(item.variantOptions).join(" · ")}
                      </p>
                    )}
                    <p className="text-sm text-neutral-700 mt-1">
                      {currency} {item.price}
                    </p>

                    {/* Qty controls + remove */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="inline-flex items-center border border-neutral-200">
                        <button
                          onClick={() =>
                            setQuantity(item.variantId, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span
                          className="w-7 text-center text-xs"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.variantId)}
                        aria-label={`${t("cart.remove_item")}: ${item.productName}`}
                        className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        {t("checkout.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-neutral-100 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">{t("cart.subtotal")}</span>
              <span className="font-semibold text-neutral-900">
                {currency} {cart?.total.toFixed(2)}
              </span>
            </div>
            <Link
              href={`${base}/checkout`}
              onClick={() => setCartOpen(false)}
              className="block w-full py-3.5 text-center text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)", color: "var(--secondary)", borderRadius: "var(--radius)" }}
            >
              {t("cart.checkout")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
