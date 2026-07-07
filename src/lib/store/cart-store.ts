import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem } from "@/lib/types/data-types";

// --- What is this file? ---
// A Zustand store. Think of it as a global useState that any component can
// read from or write to without prop drilling.
//
// Shape: one Cart per shop, keyed by shopId.
// Example: { "shop_1": { shopId, items, total }, "shop_2": { ... } }
// This way "niko-watches" and "other-shop" never mix their carts.

type CartStore = {
  // STATE
  carts: Record<string, Cart>;
  cartOpen: boolean;

  // ACTIONS
  addItem: (shopId: string, item: CartItem) => void;
  removeItem: (shopId: string, variantId: string) => void;
  updateQuantity: (shopId: string, variantId: string, quantity: number) => void;
  clearCart: (shopId: string) => void;
  setCartOpen: (open: boolean) => void;

  // SELECTORS (derived reads — not stored, computed on call)
  getCart: (shopId: string) => Cart | null;
  getItemCount: (shopId: string) => number;
};

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  // persist() wraps the store and syncs it to localStorage automatically.
  // The key "cart" is the localStorage key name.
  persist(
    (set, get) => ({
      carts: {},
      cartOpen: false,

      setCartOpen(open) {
        set({ cartOpen: open });
      },

      addItem(shopId, item) {
        set((state) => {
          const cart = state.carts[shopId] ?? {
            shopId,
            items: [],
            total: 0,
          };

          if (Object.keys(cart.items).length >= 50) return state;

          const existingIndex = cart.items.findIndex(
            (i) => i.variantId === item.variantId,
          );

          let updatedItems: CartItem[];

          if (existingIndex >= 0) {
            // Already in cart — increment quantity
            updatedItems = cart.items.map((i, idx) =>
              idx === existingIndex
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            );
          } else {
            // New item — append
            updatedItems = [...cart.items, item];
          }

          return {
            carts: {
              ...state.carts,
              [shopId]: {
                shopId,
                items: updatedItems,
                total: computeTotal(updatedItems),
              },
            },
          };
        });
      },

      removeItem(shopId, variantId) {
        set((state) => {
          const cart = state.carts[shopId];
          if (!cart) return state;

          const updatedItems = cart.items.filter(
            (i) => i.variantId !== variantId,
          );

          return {
            carts: {
              ...state.carts,
              [shopId]: {
                ...cart,
                items: updatedItems,
                total: computeTotal(updatedItems),
              },
            },
          };
        });
      },

      updateQuantity(shopId, variantId, quantity) {
        if (quantity < 1) {
          get().removeItem(shopId, variantId);
          return;
        }

        set((state) => {
          const cart = state.carts[shopId];
          if (!cart) return state;

          const updatedItems = cart.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          );

          return {
            carts: {
              ...state.carts,
              [shopId]: {
                ...cart,
                items: updatedItems,
                total: computeTotal(updatedItems),
              },
            },
          };
        });
      },

      clearCart(shopId) {
        set((state) => {
          const updated = { ...state.carts };
          delete updated[shopId];
          return { carts: updated };
        });
      },

      getCart(shopId) {
        return get().carts[shopId] ?? null;
      },

      getItemCount(shopId) {
        const cart = get().carts[shopId];
        if (!cart) return 0;
        return cart.items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "cart",
      // Only persist cart data — not UI state like cartOpen
      partialize: (state) => ({ carts: state.carts }),
    },
  ),
);
