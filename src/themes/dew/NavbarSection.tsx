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
      <div
        className="hidden md:grid items-center px-10 xl:px-20 py-4 border-b border-[var(--subtle)]"
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
      >
        {/* Left: nav links */}
        <nav>
          <ul className="flex items-center gap-7">
            {items.map((item, i) => {
              if (item.type === "link") {
                return (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="font-jakarta text-[14px] font-medium text-[#2C2530] hover:text-[var(--accent)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              if (item.type === "group") {
                return (
                  <li key={i} className="relative group">
                    <button type="button" aria-haspopup="true" className="font-jakarta text-[14px] font-medium text-[#2C2530] hover:text-[var(--accent)] transition-colors cursor-pointer bg-transparent border-0 p-0">
                      {item.label}
                    </button>
                    <div className="absolute left-0 top-full pt-2 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity">
                      <div className="bg-[var(--page-bg)] border border-[var(--subtle)] rounded-xl overflow-hidden shadow-sm">
                        {item.children.map((child, j) =>
                          child.type === "link" ? (
                            <Link
                              key={j}
                              href={child.href}
                              className="block px-5 py-3 font-jakarta text-[14px] text-[#2C2530] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors"
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

        {/* Center: wordmark */}
        <Link
          href={logoHref}
          className="font-jakarta font-extrabold text-[26px] text-[#2C2530] text-center leading-none hover:opacity-80 transition-opacity"
        >
          {shopName ?? "Shop"}
          <span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        {/* Right: search + pill bag */}
        <div className="flex items-center gap-5 justify-end">
          <Link
            href={`${base}/search`}
            className="font-jakarta text-[14px] font-medium text-[#2C2530] hover:text-[var(--accent)] transition-colors"
          >
            Search
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="font-jakarta font-semibold text-[14px] text-white flex items-center gap-2 cursor-pointer px-5 py-2 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", borderRadius: "var(--pill)" }}
          >
            Bag
            {itemCount > 0 && (
              <span className="font-jakarta font-bold text-[12px] bg-white text-[var(--accent)] px-[7px] py-[1px] leading-tight"
                style={{ borderRadius: "var(--pill)" }}>
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--subtle)]">
        <Link
          href={logoHref}
          className="font-jakarta font-extrabold text-[22px] text-[#2C2530] leading-none"
        >
          {shopName ?? "Shop"}
          <span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={`${base}/search`}
            aria-label="Search"
            className="text-[#2C2530] hover:text-[var(--accent)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open bag"
            className="font-jakarta font-semibold text-[13px] text-white flex items-center gap-1.5 px-4 py-1.5 cursor-pointer"
            style={{ backgroundColor: "var(--accent)", borderRadius: "var(--pill)" }}
          >
            Bag
            {itemCount > 0 && (
              <span className="font-bold text-[11px] bg-white text-[var(--accent)] px-[6px] leading-tight"
                style={{ borderRadius: "var(--pill)" }}>
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center gap-[5px]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`block h-[1.5px] w-5 bg-[#2C2530] transition-all origin-center ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-[#2C2530] transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-[#2C2530] transition-all origin-center ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
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
                    className="block py-4 font-jakarta text-[14px] font-medium text-[#2C2530] hover:text-[var(--accent)] transition-colors"
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
                    className="w-full flex items-center justify-between py-4 font-jakarta text-[14px] font-medium text-[#2C2530]"
                    aria-expanded={isGroupOpen}
                  >
                    {item.label}
                    <span className={`text-[var(--muted)] transition-transform text-xl leading-none ${isGroupOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isGroupOpen ? "max-h-[300px] pb-3" : "max-h-0"}`}>
                    {item.children.map((child, j) =>
                      child.type === "link" ? (
                        <Link
                          key={j}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-3 pl-4 font-jakarta text-[14px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
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
