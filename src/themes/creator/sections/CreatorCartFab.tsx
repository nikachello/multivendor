"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useCartStore } from "@/lib/store/cart-store";

type Props = {
  shopId: string;
  shopBase: string;
  currency: string;
};

function BagIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l1 12H5z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function CreatorCartFab({ shopId, shopBase, currency }: Props) {
  const { cart, remove, setQuantity } = useCart(shopId);
  const cartOpen = useCartStore((s) => s.cartOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  function formatPrice(n: number) {
    return `${n.toFixed(2)} ${currency}`;
  }

  function formatVariantOptions(opts: Record<string, string>): string {
    return Object.values(opts).filter(Boolean).join(" · ");
  }

  return (
    <>
      {/* FAB — hidden when cart is empty or drawer is open */}
      {itemCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <BagIcon />
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-[var(--creator-on-surface)] text-[var(--creator-surface)] text-[10px] font-bold flex items-center justify-center px-1">
            {itemCount}
          </span>
        </button>
      )}

      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[var(--creator-surface)] flex flex-col transition-transform duration-300 " +
          (cartOpen ? "translate-x-0" : "translate-x-full")
        }
        style={{ fontFamily: "var(--creator-body-font)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--creator-subtle)] flex items-center justify-between">
          <h2 className="text-lg text-[var(--creator-on-surface)]" style={{ fontFamily: "var(--creator-display-font)" }}>
            Your cart
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="w-9 h-9 rounded-xl ring-1 ring-[var(--creator-subtle)] flex items-center justify-center text-[var(--creator-on-surface)]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items / empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5">
            <span className="text-[var(--creator-muted)] opacity-40">
              <BagIcon size={48} />
            </span>
            <p className="text-lg text-[var(--creator-on-surface)]" style={{ fontFamily: "var(--creator-display-font)" }}>
              Your cart is empty
            </p>
            <button
              onClick={() => setCartOpen(false)}
              className="h-12 rounded-2xl ring-1 ring-[var(--creator-subtle)] px-6 text-sm font-semibold text-[var(--creator-on-surface)] bg-transparent"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--creator-subtle)]">
                  {item.image && (
                    <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--creator-on-surface)] line-clamp-2">
                      {item.productName}
                    </p>
                    <span className="text-sm font-semibold text-[var(--creator-on-surface)] tabular-nums whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  {Object.keys(item.variantOptions).length > 0 && (
                    <p className="text-xs text-[var(--creator-muted)] mt-0.5">
                      {formatVariantOptions(item.variantOptions)}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg ring-1 ring-[var(--creator-subtle)] flex items-center justify-center text-[var(--creator-on-surface)]"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold tabular-nums text-[var(--creator-on-surface)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg ring-1 ring-[var(--creator-subtle)] flex items-center justify-center text-[var(--creator-on-surface)]"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.variantId)}
                      className="text-xs text-[var(--creator-muted)] hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[var(--creator-subtle)]">
            <div className="flex items-center justify-between font-semibold text-[var(--creator-on-surface)]">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-[var(--creator-muted)] mt-1">
              Shipping calculated at checkout
            </p>
            <Link
              href={`${shopBase}/checkout`}
              onClick={() => setCartOpen(false)}
              className="mt-4 flex items-center justify-center w-full h-14 rounded-2xl bg-[var(--primary)] text-white font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Checkout →
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm text-[var(--creator-muted)] mt-3 hover:text-[var(--creator-on-surface)] transition-colors"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
