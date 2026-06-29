"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = { shopSlug: string; shopBase?: string; initialQuery: string };

export default function SearchInput({ shopSlug, shopBase, initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const isFirstRender = useRef(true);
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

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
      placeholder="Search products…"
      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
    />
  );
}
