"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NavbarSectionProps } from "@/lib/types/sections";
import { useCartStore } from "@/lib/store/cart-store";
import { useCart } from "@/hooks/useCart";

const NavbarSection = ({
  items = [],
  transparent = false,
  shopName,
  shopSlug = "",
  shopBase,
  shopId = "",
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { itemCount } = useCart(shopId);

  const base = shopBase !== undefined ? shopBase : shopSlug ? `/shop/${shopSlug}` : "";
  const logoHref = base || "/";

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const isLight = transparent && !scrolled;
  const bg = isLight
    ? "bg-transparent"
    : "bg-white border-b border-neutral-100 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]";
  const textColor = isLight ? "text-white" : "text-neutral-900";
  const mutedColor = isLight ? "text-white/70" : "text-neutral-500";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${bg}`}
    >
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex items-center justify-between px-10 py-5">
        <Link
          href={logoHref}
          className={`text-sm font-bold tracking-[0.25em] uppercase transition-colors ${textColor}`}
        >
          {shopName ?? "Shop"}
        </Link>

        <nav>
          <ul className={`flex items-center gap-8 text-[11px] font-medium tracking-[0.12em] uppercase ${mutedColor}`}>
            {items.map((item, index) => {
              if (item.type === "link") {
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`transition-colors hover:${isLight ? "text-white" : "text-neutral-900"} whitespace-nowrap`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              if (item.type === "group") {
                return (
                  <li key={index} className="relative group">
                    {item.href ? (
                      <Link href={item.href} className="cursor-pointer flex items-center gap-1 whitespace-nowrap">
                        {item.label}
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                    ) : (
                      <button type="button" aria-haspopup="true" className="cursor-pointer bg-transparent border-0 p-0 flex items-center gap-1 whitespace-nowrap">
                        {item.label}
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <div className="absolute left-0 top-full pt-3 min-w-[200px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150">
                      <div className="bg-white border border-neutral-100 shadow-lg py-2">
                        {item.children.map((child, i) =>
                          child.type === "link" ? (
                            <Link
                              key={i}
                              href={child.href}
                              className="block px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                            >
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
          <Link
            href={`${base}/search`}
            className={`transition-colors ${mutedColor}`}
            aria-label="Search"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className={`relative cursor-pointer transition-colors ${mutedColor}`}
            aria-label="Open cart"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-5">
        <Link href={logoHref} className={`text-sm font-bold tracking-[0.25em] uppercase ${textColor}`}>
          {shopName ?? "Shop"}
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`${base}/search`} className={mutedColor} aria-label="Search">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button onClick={() => setCartOpen(true)} className={`relative cursor-pointer ${mutedColor}`} aria-label="Open cart">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-neutral-900 text-white text-[9px] flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label="Toggle menu" aria-expanded={open}
          >
            <span className={`block h-px w-5 transition-all origin-center ${isLight ? "bg-white" : "bg-neutral-900"} ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px w-5 transition-all ${isLight ? "bg-white" : "bg-neutral-900"} ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 transition-all origin-center ${isLight ? "bg-white" : "bg-neutral-900"} ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full left-0 w-full z-50 md:hidden bg-white border-b border-neutral-100 overflow-hidden transition-all duration-200 ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="flex flex-col text-[11px] tracking-[0.12em] uppercase font-medium text-neutral-500 px-5 py-4 gap-0.5">
          {items.map((item, index) => {
            if (item.type === "link") {
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 border-b border-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            if (item.type === "group") {
              const isGroupOpen = openGroup === index;
              return (
                <li key={index} className="border-b border-neutral-100">
                  <div className="flex items-center justify-between py-3.5">
                    {item.href ? (
                      <Link href={item.href} onClick={() => setOpen(false)} className="hover:text-neutral-900 transition-colors">{item.label}</Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    <button onClick={() => setOpenGroup(isGroupOpen ? null : index)} className="p-1 text-neutral-400">
                      <svg className={`w-3 h-3 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-200 ${isGroupOpen ? "max-h-[400px] pb-3" : "max-h-0"}`}>
                    {item.children.map((child, i) =>
                      child.type === "link" ? (
                        <Link key={i} href={child.href} onClick={() => setOpen(false)} className="block py-2 pl-3 hover:text-neutral-900 transition-colors">
                          {child.label}
                        </Link>
                      ) : null
                    )}
                  </div>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </header>
  );
};

export default NavbarSection;
