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
  shopBase,
  shopId = "",
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { itemCount } = useCart(shopId);

  const base = shopBase !== undefined ? shopBase : (shopSlug ? `/shop/${shopSlug}` : "");
  const logoHref = base || "/";

  const bg = transparent ? "bg-transparent" : "bg-white border-b border-zinc-100";
  const textColor = transparent ? "text-white" : "text-zinc-900";
  const mutedColor = transparent ? "text-white/70" : "text-zinc-500";
  const hoverColor = transparent ? "hover:text-white" : "hover:text-zinc-900";
  const dropdownBg = "bg-white border border-zinc-100 shadow-sm";

  return (
    <header className={`relative w-full z-20 ${bg}`}>
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex items-center justify-between px-10 py-5">
        {/* Logo — left aligned */}
        <Link
          href={logoHref}
          className={`text-sm font-bold tracking-[0.2em] uppercase ${textColor}`}
        >
          {shopName ?? "Shop"}
        </Link>

        {/* Nav + icons — right side */}
        <div className="flex items-center gap-8">
          <nav>
            <ul className={`flex items-center gap-7 text-sm ${mutedColor}`}>
              {items.map((item, index) => {
                if (item.type === "link") {
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`${hoverColor} transition-colors whitespace-nowrap`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                if (item.type === "group") {
                  const trigger = item.href ? (
                    <Link href={item.href} className={`${hoverColor} transition-colors flex items-center gap-1 whitespace-nowrap`}>
                      {item.label}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  ) : (
                    <button type="button" aria-haspopup="true" className={`cursor-pointer bg-transparent border-0 p-0 ${hoverColor} transition-colors flex items-center gap-1 whitespace-nowrap`}>
                      {item.label}
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  );

                  return (
                    <li key={index} className="relative group">
                      {trigger}
                      <div className="absolute right-0 top-full pt-2 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity">
                        <div className={`${dropdownBg} py-1`}>
                          {item.children.map((child, i) =>
                            child.type === "link" ? (
                              <Link
                                key={i}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                              >
                                {child.label}
                              </Link>
                            ) : child.type === "group" ? (
                              <div key={i}>
                                {child.href ? (
                                  <Link href={child.href} className="block px-4 pt-3 pb-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                                    {child.label}
                                  </Link>
                                ) : (
                                  <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-zinc-400">{child.label}</p>
                                )}
                                {child.children.map((gc, j) =>
                                  gc.type === "link" ? (
                                    <Link key={j} href={gc.href} className="block px-4 py-2 pl-6 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                                      {gc.label}
                                    </Link>
                                  ) : null
                                )}
                              </div>
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

          <div className="flex items-center gap-4">
            <Link
              href={`${base}/search`}
              className={`${mutedColor} ${hoverColor} transition-colors`}
              aria-label="Search"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className={`relative cursor-pointer ${mutedColor} ${hoverColor} transition-colors`}
              aria-label="Open cart"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] flex items-center justify-center font-medium">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-5">
        <Link
          href={logoHref}
          className={`text-sm font-bold tracking-[0.2em] uppercase ${textColor}`}
        >
          {shopName ?? "Shop"}
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={`${base}/search`}
            className={`${transparent ? "text-white" : "text-zinc-500"}`}
            aria-label="Search"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className={`relative cursor-pointer ${transparent ? "text-white" : "text-zinc-500"}`}
            aria-label="Open cart"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-zinc-900 text-white text-[9px] flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
            aria-label="Toggle menu" aria-expanded={open}
          >
            <span className={`block h-px w-5 transition-all origin-center ${transparent ? "bg-white" : "bg-zinc-900"} ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`block h-px w-5 transition-all ${transparent ? "bg-white" : "bg-zinc-900"} ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 transition-all origin-center ${transparent ? "bg-white" : "bg-zinc-900"} ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`absolute top-full left-0 w-full z-50 md:hidden bg-white border-b border-zinc-100 overflow-hidden transition-all duration-200 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="flex flex-col text-sm text-zinc-600 px-5 py-4 gap-0.5">
          {items.map((item, index) => {
            if (item.type === "link") {
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 border-b border-zinc-100 hover:text-zinc-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            if (item.type === "group") {
              const isGroupOpen = openGroup === index;
              return (
                <li key={index} className="border-b border-zinc-100">
                  <div className="flex items-center justify-between py-3">
                    {item.href ? (
                      <Link href={item.href} onClick={() => setOpen(false)} className="hover:text-zinc-900 transition-colors">{item.label}</Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    <button onClick={() => setOpenGroup(isGroupOpen ? null : index)} className="p-1 text-zinc-400">
                      <svg className={`w-3 h-3 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-200 ${isGroupOpen ? "max-h-[500px] pb-3" : "max-h-0"}`}>
                    {item.children.map((child, i) =>
                      child.type === "link" ? (
                        <Link key={i} href={child.href} onClick={() => setOpen(false)} className="block py-2 pl-3 hover:text-zinc-900 transition-colors">
                          {child.label}
                        </Link>
                      ) : child.type === "group" ? (
                        <div key={i}>
                          <p className="pl-3 pt-2 pb-1 text-[10px] tracking-[0.08em] uppercase text-zinc-400">{child.label}</p>
                          {child.children.map((gc, j) =>
                            gc.type === "link" ? (
                              <Link key={j} href={gc.href} onClick={() => setOpen(false)} className="block py-1.5 pl-5 hover:text-zinc-900 transition-colors">
                                {gc.label}
                              </Link>
                            ) : null
                          )}
                        </div>
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
