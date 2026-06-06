"use client";

import { useState } from "react";
import Link from "next/link";
import { NavbarSectionProps } from "@/lib/types/sections";

const NavbarSection = ({
  items = [],
  transparent = false,
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);

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
                return (
                  <li key={index} className="relative group">
                    <span
                      className={`cursor-pointer ${hoverColor} transition-colors duration-200 flex items-center gap-1 whitespace-nowrap`}
                    >
                      {item.label}
                      <svg
                        className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>

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
            href="/"
            className={`text-xl font-semibold tracking-tight ${textColor}`}
          >
            Logo
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <ul className={`flex items-center gap-6 text-sm ${mutedColor}`}>
            {["Search", "Cart", "Account"].map((label) => (
              <li
                key={label}
                className={`${hoverColor} cursor-pointer transition-colors duration-200`}
              >
                {label}
              </li>
            ))}
          </ul>
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
            href="/"
            className={`text-xl font-semibold tracking-tight ${textColor}`}
          >
            Logo
          </Link>
        </div>

        <svg
          className={`w-5 h-5 ${transparent ? "text-white" : "text-black"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>

      {/* BACKDROP — covers entire screen including navbar, closes menu on click */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
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
              return (
                <li key={index} className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenGroup(isGroupOpen ? null : index)}
                    className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-black transition-colors"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isGroupOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isGroupOpen ? "max-h-40 pb-3" : "max-h-0"
                    }`}
                  >
                    <div className="ml-3 flex flex-col gap-1">
                      {item.children.map((child, i) =>
                        child.type === "link" ? (
                          <Link
                            key={i}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-gray-500 hover:text-black transition-colors"
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

          <li className="pt-4 flex gap-6 text-gray-500">
            {["Search", "Cart", "Account"].map((label) => (
              <span
                key={label}
                className="hover:text-black cursor-pointer transition-colors"
              >
                {label}
              </span>
            ))}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavbarSection;
