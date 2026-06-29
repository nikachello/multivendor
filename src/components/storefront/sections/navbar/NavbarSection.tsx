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

  const textColor = transparent ? "text-white" : "text-black";
  const mutedColor = transparent ? "text-white/80" : "text-gray-500";
  const hoverColor = transparent ? "hover:text-white" : "hover:text-black";
  const bg = transparent
    ? "bg-transparent"
    : "bg-white border-b border-gray-100";

  return (
    <header className={`relative w-full z-20 ${bg}`}>
      {/* ── DESKTOP ── */}
      <div className="hidden md:flex items-center justify-between px-10 py-9">
        <nav className="flex-1">
          <ul className={`flex items-center gap-8 text-sm ${mutedColor}`}>
            {items.map((item, index) => {
              if (item.type === "link") {
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`${hoverColor} transition-colors duration-200 whitespace-nowrap`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              if (item.type === "group") {
                const hasMegaMenu = item.children.some(c => c.type === "group");
                const subGroups = item.children.filter(c => c.type === "group");
                const standaloneLinks = item.children.filter(c => c.type === "link");

                const chevron = (
                  <svg
                    className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                );

                const trigger = item.href ? (
                  <Link href={item.href} className={`${hoverColor} transition-colors duration-200 flex items-center gap-1 whitespace-nowrap`}>
                    {item.label}
                    {chevron}
                  </Link>
                ) : (
                  <span className={`cursor-pointer ${hoverColor} transition-colors duration-200 flex items-center gap-1 whitespace-nowrap`}>
                    {item.label}
                    {chevron}
                  </span>
                );

                if (hasMegaMenu) {
                  return (
                    <li key={index} className="relative group">
                      {trigger}
                      <div className="absolute left-0 top-full pt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                        <div className="bg-white border border-gray-100 shadow-xl rounded-sm flex divide-x divide-gray-100">
                          {standaloneLinks.length > 0 && (
                            <div className="min-w-[150px] py-3">
                              {standaloneLinks.map((link, i) =>
                                link.type === "link" ? (
                                  <Link
                                    key={i}
                                    href={link.href}
                                    className="block px-5 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-150"
                                  >
                                    {link.label}
                                  </Link>
                                ) : null
                              )}
                            </div>
                          )}
                          {subGroups.map((sg, i) =>
                            sg.type === "group" ? (
                              <div key={i} className="min-w-[160px] py-3">
                                {sg.href ? (
                                  <Link href={sg.href} className="block px-5 pt-1 pb-2.5 text-[10px] tracking-widest uppercase text-gray-400 hover:text-black font-medium border-b border-gray-100 transition-colors">
                                    {sg.label}
                                  </Link>
                                ) : (
                                  <p className="px-5 pt-1 pb-2.5 text-[10px] tracking-widest uppercase text-gray-400 font-medium border-b border-gray-100">
                                    {sg.label}
                                  </p>
                                )}
                                {sg.children.map((gc, j) => {
                                  if (gc.type === "link") {
                                    return (
                                      <Link
                                        key={j}
                                        href={gc.href}
                                        className="block px-5 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-150"
                                      >
                                        {gc.label}
                                      </Link>
                                    );
                                  }
                                  if (gc.type === "group") {
                                    return (
                                      <div key={j} className="mt-1">
                                        <p className="px-5 pt-2.5 pb-1 text-[10px] tracking-widest uppercase text-gray-300">
                                          {gc.label}
                                        </p>
                                        {gc.children.map((ggc, k) =>
                                          ggc.type === "link" ? (
                                            <Link
                                              key={k}
                                              href={ggc.href}
                                              className="block px-5 pl-7 py-1.5 text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-colors duration-150"
                                            >
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
                    <div className="absolute left-0 top-full pt-2 min-w-[180px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                      <div className="bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden">
                        {item.children.map((child, i) =>
                          child.type === "link" ? (
                            <Link
                              key={i}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors duration-150"
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

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href={logoHref}
            className={`text-xl font-semibold tracking-tight ${textColor}`}
          >
            {shopName ?? "Logo"}
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <Link
            href={`${base}/search`}
            className={`${mutedColor} ${hoverColor} transition-colors duration-200`}
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className={`relative ${mutedColor} ${hoverColor} cursor-pointer transition-colors duration-200`}
            aria-label="Open cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium" style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}>
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-7.5">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col justify-center items-center w-8 h-8 gap-[5px] z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-[1.5px] w-6 transition-all duration-300 origin-center ${
              transparent ? "bg-white" : "bg-black"
            } ${open ? "rotate-45 translate-y-[6.5px]" : ""}`}
          />
          <span
            className={`block h-[1.5px] w-6 transition-all duration-300 ${
              transparent ? "bg-white" : "bg-black"
            } ${open ? "opacity-0 scale-x-0" : ""}`}
          />
          <span
            className={`block h-[1.5px] w-6 transition-all duration-300 origin-center ${
              transparent ? "bg-white" : "bg-black"
            } ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
          />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href={logoHref}
            className={`text-xl font-semibold tracking-tight ${textColor}`}
          >
            {shopName ?? "Logo"}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`${base}/search`}
            className={`${transparent ? "text-white" : "text-black"}`}
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className={`relative ${transparent ? "text-white" : "text-black"}`}
            aria-label="Open cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#C25447] text-white text-[10px] flex items-center justify-center font-medium">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
          </button>
        </div>
      </div>

      {/* Mobile backdrop — always in DOM so opacity can transition with the menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`absolute top-full left-0 w-full z-50 md:hidden bg-white shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col text-sm text-black px-5 py-4 gap-1">
          {items.map((item, index) => {
            if (item.type === "link") {
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 border-b border-gray-100 text-gray-700 hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            if (item.type === "group") {
              const isGroupOpen = openGroup === index;
              const hasSubs = item.children.some(c => c.type === "group");
              return (
                <li key={index} className="border-b border-gray-100">
                  <div className="flex items-center justify-between py-3">
                    {item.href ? (
                      <Link href={item.href} onClick={() => setOpen(false)} className="text-gray-700 hover:text-black transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-700">{item.label}</span>
                    )}
                    <button
                      onClick={() => setOpenGroup(isGroupOpen ? null : index)}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isGroupOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isGroupOpen ? (hasSubs ? "max-h-96" : "max-h-48") + " pb-3" : "max-h-0"
                    }`}
                  >
                    <div className="flex flex-col">
                      {item.children.map((child, i) => {
                        if (child.type === "link") {
                          return (
                            <Link
                              key={i}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block py-2 pl-3 text-gray-500 hover:text-black transition-colors"
                            >
                              {child.label}
                            </Link>
                          );
                        }
                        if (child.type === "group") {
                          return (
                            <div key={i} className="mt-2">
                              <p className="pl-3 py-1.5 text-[10px] tracking-widest uppercase text-gray-400 bg-gray-50 border-y border-gray-100">
                                {child.label}
                              </p>
                              {child.children.map((gc, j) => {
                                if (gc.type === "link") {
                                  return (
                                    <Link
                                      key={j}
                                      href={gc.href}
                                      onClick={() => setOpen(false)}
                                      className="block py-2 pl-5 text-gray-500 hover:text-black transition-colors"
                                    >
                                      {gc.label}
                                    </Link>
                                  );
                                }
                                if (gc.type === "group") {
                                  return (
                                    <div key={j}>
                                      <p className="pl-5 py-1.5 text-[10px] tracking-widest uppercase text-gray-300">
                                        {gc.label}
                                      </p>
                                      {gc.children.map((ggc, k) =>
                                        ggc.type === "link" ? (
                                          <Link
                                            key={k}
                                            href={ggc.href}
                                            onClick={() => setOpen(false)}
                                            className="block py-1.5 pl-8 text-gray-400 hover:text-black transition-colors"
                                          >
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
                          );
                        }
                        return null;
                      })}
                    </div>
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
