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
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { itemCount } = useCart(shopId);

  const logoHref = shopSlug ? `/shop/${shopSlug}` : "/";

  const bg = transparent ? "bg-transparent" : "bg-[#F8F6F1] border-b border-[#E2DDD5]";
  const textColor = transparent ? "text-white" : "text-[#1C1C1C]";
  const mutedColor = transparent ? "text-white/75" : "text-[#8A8072]";
  const hoverColor = transparent ? "hover:text-white" : "hover:text-[#1C1C1C]";
  const dropdownBg = "bg-[#F8F6F1] border border-[#E2DDD5]";

  return (
    <header className={`relative w-full z-20 ${bg}`}>
      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-between px-10 py-7">
        <nav className="flex-1">
          <ul className={`flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase ${mutedColor}`}>
            {items.map((item, index) => {
              if (item.type === "link") {
                return (
                  <li key={index}>
                    <Link href={item.href} className={`${hoverColor} transition-colors whitespace-nowrap`}>
                      {item.label}
                    </Link>
                  </li>
                );
              }

              if (item.type === "group") {
                const hasMegaMenu = item.children.some((c) => c.type === "group");
                const subGroups = item.children.filter((c) => c.type === "group");
                const standaloneLinks = item.children.filter((c) => c.type === "link");

                const chevron = (
                  <svg className="w-2.5 h-2.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                );

                const trigger = item.href ? (
                  <Link href={item.href} className={`${hoverColor} transition-colors flex items-center gap-1.5 whitespace-nowrap`}>
                    {item.label} {chevron}
                  </Link>
                ) : (
                  <span className={`cursor-pointer ${hoverColor} transition-colors flex items-center gap-1.5 whitespace-nowrap`}>
                    {item.label} {chevron}
                  </span>
                );

                if (hasMegaMenu) {
                  return (
                    <li key={index} className="relative group">
                      {trigger}
                      <div className="absolute left-0 top-full pt-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                        <div className={`${dropdownBg} flex divide-x divide-[#E2DDD5]`}>
                          {standaloneLinks.length > 0 && (
                            <div className="min-w-[150px] py-4">
                              {standaloneLinks.map((link, i) =>
                                link.type === "link" ? (
                                  <Link key={i} href={link.href} className="block px-5 py-2 text-[11px] tracking-[0.08em] normal-case text-[#8A8072] hover:text-[#1C1C1C] transition-colors">
                                    {link.label}
                                  </Link>
                                ) : null
                              )}
                            </div>
                          )}
                          {subGroups.map((sg, i) =>
                            sg.type === "group" ? (
                              <div key={i} className="min-w-[160px] py-4">
                                {sg.href ? (
                                  <Link href={sg.href} className="block px-5 pt-1 pb-3 text-[10px] tracking-[0.15em] uppercase text-[#8A8072] hover:text-[#1C1C1C] border-b border-[#E2DDD5] transition-colors">
                                    {sg.label}
                                  </Link>
                                ) : (
                                  <p className="px-5 pt-1 pb-3 text-[10px] tracking-[0.15em] uppercase text-[#8A8072] border-b border-[#E2DDD5]">
                                    {sg.label}
                                  </p>
                                )}
                                {sg.children.map((gc, j) => {
                                  if (gc.type === "link") {
                                    return (
                                      <Link key={j} href={gc.href} className="block px-5 py-2 text-[11px] tracking-[0.08em] normal-case text-[#8A8072] hover:text-[#1C1C1C] transition-colors">
                                        {gc.label}
                                      </Link>
                                    );
                                  }
                                  if (gc.type === "group") {
                                    return (
                                      <div key={j} className="mt-1">
                                        <p className="px-5 pt-2 pb-1 text-[10px] tracking-[0.15em] uppercase text-[#8A8072]/60">
                                          {gc.label}
                                        </p>
                                        {gc.children.map((ggc, k) =>
                                          ggc.type === "link" ? (
                                            <Link key={k} href={ggc.href} className="block px-5 pl-7 py-1.5 text-[11px] tracking-[0.08em] normal-case text-[#8A8072] hover:text-[#1C1C1C] transition-colors">
                                              {ggc.label}
                                            </Link>
                                          ) : null
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={index} className="relative group">
                    {trigger}
                    <div className="absolute left-0 top-full pt-3 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      <div className={`${dropdownBg} py-2`}>
                        {item.children.map((child, i) =>
                          child.type === "link" ? (
                            <Link key={i} href={child.href} className="block px-5 py-2 text-[11px] tracking-[0.08em] normal-case text-[#8A8072] hover:text-[#1C1C1C] transition-colors">
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

        {/* Wordmark — centered */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href={logoHref} className={`font-display text-2xl font-normal tracking-wide ${textColor}`}>
            {shopName ?? "Maison"}
          </Link>
        </div>

        {/* Icons */}
        <div className="flex-1 flex justify-end items-center gap-5">
          <Link href={`/shop/${shopSlug}/search`} className={`${mutedColor} ${hoverColor} transition-colors`} aria-label="Search">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button onClick={() => setCartOpen(true)} className={`relative ${mutedColor} ${hoverColor} transition-colors cursor-pointer`} aria-label="Open cart">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#F8F6F1] text-[9px] flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex items-center justify-between px-5 py-6">
        <button onClick={() => setOpen(!open)} className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]" aria-label="Toggle menu">
          <span className={`block h-px w-6 transition-all origin-center ${transparent ? "bg-white" : "bg-[#1C1C1C]"} ${open ? "rotate-45 translate-y-[5px]" : ""}`} />
          <span className={`block h-px w-6 transition-all ${transparent ? "bg-white" : "bg-[#1C1C1C]"} ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 transition-all origin-center ${transparent ? "bg-white" : "bg-[#1C1C1C]"} ${open ? "-rotate-45 -translate-y-[5px]" : ""}`} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href={logoHref} className={`font-display text-xl font-normal tracking-wide ${textColor}`}>
            {shopName ?? "Maison"}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/shop/${shopSlug}/search`} className={transparent ? "text-white" : "text-[#8A8072]"} aria-label="Search">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button onClick={() => setCartOpen(true)} className={`relative ${transparent ? "text-white" : "text-[#8A8072]"}`} aria-label="Open cart">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#F8F6F1] text-[9px] flex items-center justify-center font-medium">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu */}
      <div className={`absolute top-full left-0 w-full z-50 md:hidden bg-[#F8F6F1] border-b border-[#E2DDD5] overflow-hidden transition-all duration-200 ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <ul className="flex flex-col text-[11px] tracking-[0.12em] uppercase text-[#8A8072] px-5 py-4 gap-0.5">
          {items.map((item, index) => {
            if (item.type === "link") {
              return (
                <li key={index}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 border-b border-[#E2DDD5] hover:text-[#1C1C1C] transition-colors">
                    {item.label}
                  </Link>
                </li>
              );
            }
            if (item.type === "group") {
              const isGroupOpen = openGroup === index;
              return (
                <li key={index} className="border-b border-[#E2DDD5]">
                  <div className="flex items-center justify-between py-3">
                    {item.href ? (
                      <Link href={item.href} onClick={() => setOpen(false)} className="hover:text-[#1C1C1C] transition-colors">{item.label}</Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    <button onClick={() => setOpenGroup(isGroupOpen ? null : index)} className="p-1">
                      <svg className={`w-2.5 h-2.5 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-200 ${isGroupOpen ? "max-h-[500px] pb-3" : "max-h-0"}`}>
                    {item.children.map((child, i) =>
                      child.type === "link" ? (
                        <Link key={i} href={child.href} onClick={() => setOpen(false)} className="block py-2 pl-3 hover:text-[#1C1C1C] transition-colors">
                          {child.label}
                        </Link>
                      ) : child.type === "group" ? (
                        <div key={i}>
                          <p className="px-3 pt-3 pb-1 text-[9px] tracking-[0.15em] uppercase text-[#8A8072]/60">
                            {child.label}
                          </p>
                          {child.children.map((gc, j) =>
                            gc.type === "link" ? (
                              <Link key={j} href={gc.href} onClick={() => setOpen(false)} className="block py-1.5 pl-5 hover:text-[#1C1C1C] transition-colors">
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
