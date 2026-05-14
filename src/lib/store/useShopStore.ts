import { create } from "zustand";

type ShopState = {
  shopId: string | null;
  name: string | null;
  slug: string | null;
  currency: string;

  setShop: (data: {
    shopId: string;
    name: string;
    slug: string;
    currency: string;
  }) => void;

  reset: () => void;
};

export const useShopStore = create<ShopState>((set) => ({
  shopId: null,
  name: null,
  slug: null,
  currency: "",

  setShop: (data) =>
    set({
      shopId: data.shopId,
      name: data.name,
      slug: data.slug,
      currency: data.currency,
    }),

  reset: () =>
    set({
      shopId: null,
      name: null,
      slug: null,
      currency: "",
    }),
}));
