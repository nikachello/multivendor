"use client";

import { useState } from "react";
import Link from "next/link";
import { NavbarSectionProps } from "@/lib/types/sections";
import { useCartStore } from "@/lib/store/cart-store";
import { useCart } from "@/hooks/useCart";

const NavbarSection = ({
  items = [],
  shopName,
  shopSlug = "",
  shopBase,
  shopId = "",
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { itemCount } = useCart(shopId);

  const base = shopBase !== undefined ? shopBase : (shopSlug ? `/shop/${shopSlug}` : "");
  const logoHref = base || "/";

  return (
    <header className="relative w-full z-20 bg-[var(--page-bg)]">
      {/* ── DESKTOP ── */}
      <div className="hidden md:grid items-center px-10 xl:px-20 py-5 border-b border-[var(--subtle)]"
        style={{ gridTemplateColumns: "1fr auto 1fr" }}>

        {/* Left: nav links */}
        <nav>
          <ul className="flex items-center gap-7">
            {items.map((item, i) => {
              if (item.type === "link") {
                return (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-[12px] tracking-[0.13em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              if (item.type === "group") {
                return (
                  <li key={i} className="relative group">
                    <span className="text-[12px] tracking-[0.13em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors cursor-pointer">
                      {item.label}
                    </span>
                    <div className="absolute left-0 top-full pt-2 min-w-[160px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      <div className="bg-[var(--page-bg)] border border-[var(--subtle)]">
                        {item.children.map((child, j) =>
                          child.type === "link" ? (
                            <Link
                              key={j}
                              href={child.href}
                              className="block px-5 py-3 text-[12px] tracking-[0.1em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors"
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

        {/* Center: logo */}
        <Link
          href={logoHref}
          className="font-bodoni font-medium text-[28px] tracking-[0.16em] text-[#1B1714] text-center hover:text-[var(--accent)] transition-colors leading-none"
        >
          {shopName ?? "Shop"}
        </Link>

        {/* Right: search + cart */}
        <div className="flex items-center gap-7 justify-end">
          <Link
            href={`${base}/search`}
            className="text-[12px] tracking-[0.13em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors"
          >
            Search
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="text-[12px] tracking-[0.13em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            Cart
            {itemCount > 0 && (
              <span className="font-mono text-[11px] border border-current rounded-full px-[7px] py-px tracking-normal leading-tight">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-5 border-b border-[var(--subtle)]">
        <Link
          href={logoHref}
          className="font-bodoni font-medium text-[22px] tracking-[0.16em] text-[#1B1714] leading-none"
        >
          {shopName ?? "Shop"}
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={`${base}/search`}
            className="text-[#1B1714] hover:text-[var(--accent)] transition-colors"
            aria-label="Search"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative cursor-pointer text-[#1B1714] hover:text-[var(--accent)] transition-colors"
            aria-label="Open cart"
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 font-mono text-[10px] border border-[#1B1714] rounded-full px-[5px] leading-tight bg-[var(--page-bg)]">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center gap-[5px]"
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-5 bg-[#1B1714] transition-all origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px w-5 bg-[#1B1714] transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-[#1B1714] transition-all origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`absolute top-full left-0 w-full z-50 md:hidden bg-[var(--page-bg)] border-b border-[var(--subtle)] overflow-hidden transition-all duration-200 ${open ? "max-h-[600px]" : "max-h-0"}`}>
        <ul className="flex flex-col px-5 py-4">
          {items.map((item, i) => {
            if (item.type === "link") {
              return (
                <li key={i} className="border-b border-[var(--subtle)]">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-[12px] tracking-[0.16em] uppercase text-[#1B1714] hover:text-[var(--accent)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            if (item.type === "group") {
              const isGroupOpen = openGroup === i;
              return (
                <li key={i} className="border-b border-[var(--subtle)]">
                  <button
                    onClick={() => setOpenGroup(isGroupOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-[12px] tracking-[0.16em] uppercase text-[#1B1714]"
                  >
                    {item.label}
                    <span className={`text-[var(--muted)] transition-transform text-lg leading-none ${isGroupOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isGroupOpen ? "max-h-[300px] pb-3" : "max-h-0"}`}>
                    {item.children.map((child, j) =>
                      child.type === "link" ? (
                        <Link
                          key={j}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-3 pl-4 text-[12px] tracking-[0.1em] uppercase text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                        >
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
