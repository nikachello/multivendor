"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function CartCleaner({ shopId }: { shopId: string }) {
  const { clear } = useCart(shopId);
  useEffect(() => { clear(); }, [clear]);
  return null;
}
