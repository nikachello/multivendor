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
  const bg = transparent ? "bg-transparent" : "bg-[#f6ede0] border-b border-[#e7d9c5]";
  const mutedColor = transparent ? "text-white/70" : "text-[#6b5640]";
  const hoverColor = transparent ? "hover:text-white" : "hover:text-[#39291a]";

  return (
    <header className={`relative w-full z-20 ${bg}`}>
      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-between px-8 py-4.5">
        {/* Logo — circle icon + serif name */}
        <Link href={logoHref} className="flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full shrink-0"
            style={{ backgroundColor: "oklch(0.42 0.07 50)" }}
          />
          <span className={`font-display font-bold text-base tracking-wide ${transparent ? "text-white" : "text-[#39291a]"}`}>
            {shopName ?? "Roaster"}
          </span>
        </Link>

        <nav>
          <ul className={`flex items-center gap-7 text-sm ${mutedColor}`}>
            {items.map((item, index) => {
              if (item.type === "link") {
                return (
                  <li key={index}>
                    <Link href={item.href} className={`${hoverColor} transition-colors whitespace-nowrap`}>{item.label}</Link>
                  </li>
                );
              }
              if (item.type === "group") {
                return (
                  <li key={index} className="relative group">
                    <span className={`cursor-pointer ${hoverColor} transition-colors flex items-center gap-1`}>
                      {item.label}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <div className="absolute left-0 top-full pt-2 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      <div className="bg-[#fdf8ef] border border-[#e7d9c5] shadow-sm py-1 rounded-lg overflow-hidden">
                        {item.children.map((child, i) =>
                          child.type === "link" ? (
                            <Link key={i} href={child.href} className="block px-4 py-2.5 text-sm text-[#6b5640] hover:text-[#39291a] hover:bg-[#f1e9d8] transition-colors">
                              {child.label}
                            </Link>
                          ) : null
                        )}
                      </div>
                    </div>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <Link href={`/shop/${shopSlug}/search`} className={`${mutedColor} ${hoverColor} transition-colors`} aria-label="Search">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button onClick={() => setCartOpen(true)} className={`relative cursor-pointer ${mutedColor} ${hoverColor} transition-colors`} aria-label="Open cart">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[#f6ede0] text-[9px] flex items-center justify-center font-medium" style={{ backgroundColor: "oklch(0.42 0.07 50)" }}>
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex items-center justify-between px-5 py-4">
        <Link href={logoHref} className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: "oklch(0.42 0.07 50)" }} />
          <span className={`font-display font-bold text-sm ${transparent ? "text-white" : "text-[#39291a]"}`}>{shopName ?? "Roaster"}</span>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setCartOpen(true)} className={`relative cursor-pointer ${transparent ? "text-white" : "text-[#6b5640]"}`} aria-label="Open cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[#f6ede0] text-[9px] flex items-center justify-center font-medium" style={{ backgroundColor: "oklch(0.42 0.07 50)" }}>
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]" aria-label="Toggle menu">
            <span className={`block h-px w-5 transition-all origin-center ${transparent ? "bg-white" : "bg-[#39291a]"} ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px w-5 transition-all ${transparent ? "bg-white" : "bg-[#39291a]"} ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 transition-all origin-center ${transparent ? "bg-white" : "bg-[#39291a]"} ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />
      <div className={`absolute top-full left-0 w-full z-50 md:hidden bg-[#f6ede0] border-b border-[#e7d9c5] overflow-hidden transition-all duration-200 ${open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="flex flex-col text-sm text-[#6b5640] px-5 py-4 gap-0.5">
          {items.map((item, index) =>
            item.type === "link" ? (
              <li key={index}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 border-b border-[#e7d9c5] hover:text-[#39291a] transition-colors">
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
