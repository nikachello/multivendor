"use client";

import { useState } from "react";
import Link from "next/link";
import { NavbarSectionProps } from "@/lib/types/sections";
import { useCartStore } from "@/lib/store/cart-store";
import { useCart } from "@/hooks/useCart";

const NavbarSection = ({
  items = [],
  transparent = false,
  shopName,
  shopSlug = "",
  shopId = "",
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { itemCount } = useCart(shopId);

  const logoHref = shopSlug ? `/shop/${shopSlug}` : "/";

  return (
    <header className="relative w-full z-20">
      {/* DESKTOP — green bar */}
      <div
        className="hidden md:flex items-center gap-4 px-7 py-3.5"
        style={{ backgroundColor: transparent ? "transparent" : "oklch(0.55 0.13 145)" }}
      >
        <Link href={logoHref} className="text-white font-extrabold text-lg shrink-0 whitespace-nowrap">
          {shopName ?? "Market"}
        </Link>

        <Link
          href={`/shop/${shopSlug}/search`}
          className="flex-1 max-w-lg bg-white rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Search products...
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm text-white/85">
          {items.map((item, index) =>
            item.type === "link" ? (
              <Link key={index} href={item.href} className="hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            ) : null
          )}
        </nav>

        <button onClick={() => setCartOpen(true)} className="relative cursor-pointer text-white shrink-0 flex items-center gap-2" aria-label="Open cart">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="text-sm font-bold">{itemCount}</span>
          )}
        </button>
      </div>

      {/* MOBILE */}
      <div className="md:hidden" style={{ backgroundColor: transparent ? "transparent" : "oklch(0.55 0.13 145)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={logoHref} className="text-white font-extrabold text-base">
            {shopName ?? "Market"}
          </Link>
          <div className="flex items-center gap-3">
            <Link href={`/shop/${shopSlug}/search`} className="text-white/85" aria-label="Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative cursor-pointer text-white" aria-label="Open cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white text-[9px] flex items-center justify-center font-bold" style={{ color: "oklch(0.55 0.13 145)" }}>
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]" aria-label="Toggle menu">
              <span className={`block h-px w-5 bg-white transition-all origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px w-5 bg-white transition-all origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />
      <div className={`absolute top-full left-0 w-full z-50 md:hidden bg-white border-b border-zinc-100 overflow-hidden transition-all duration-200 ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="flex flex-col text-sm text-zinc-600 px-5 py-4 gap-0.5">
          {items.map((item, index) =>
            item.type === "link" ? (
              <li key={index}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 border-b border-zinc-100 hover:text-zinc-900 transition-colors">
                  {item.label}
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </header>
  );
};

export default NavbarSection;
