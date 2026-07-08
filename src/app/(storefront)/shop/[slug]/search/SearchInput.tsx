"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/i18n/context";

type Props = { shopSlug: string; shopBase?: string; initialQuery: string };

export default function SearchInput({ shopSlug, shopBase, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  const t = useT();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const q = query.trim();
      router.push(`${base}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, base, router]);

  return (
    <input
      autoFocus
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={t("storefront.search.placeholder")}
      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
    />
  );
}
