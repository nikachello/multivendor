"use client";

import { useEffect } from "react";
import { useShopStore } from "@/lib/store/useShopStore";

export default function ShopInitializer({
  shop,
}: {
  shop: {
    id: string;
    name: string;
    slug: string;
    currency: string;
  };
}) {
  const setShop = useShopStore((state) => state.setShop);

  useEffect(() => {
    setShop({
      shopId: shop.id,
      name: shop.name,
      slug: shop.slug,
      currency: shop.currency,
    });
  }, [shop, setShop]);

  return null;
}
