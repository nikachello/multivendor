import { useCartStore } from "@/lib/store/cart-store";
import { CartItem } from "@/lib/types/data-types";

// Why a hook wrapper instead of using useCartStore directly?
// Components stay decoupled from the storage implementation.
// If we ever swap Zustand for something else, only this file changes.

export function useCart(shopId: string) {
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const cart = useCartStore((s) => s.carts[shopId] ?? null);
  const itemCount = useCartStore((s) => {
    const c = s.carts[shopId];
    return c ? c.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  });

  function add(item: CartItem) {
    addItem(shopId, item);
  }

  function remove(variantId: string) {
    removeItem(shopId, variantId);
  }

  function setQuantity(variantId: string, quantity: number) {
    updateQuantity(shopId, variantId, quantity);
  }

  function clear() {
    clearCart(shopId);
  }

  return { cart, itemCount, add, remove, setQuantity, clear };
}
