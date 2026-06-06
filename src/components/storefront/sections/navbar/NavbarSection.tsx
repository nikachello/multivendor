"use client";
import { useState } from "react";
import { NavbarSectionProps } from "@/lib/types/sections";

const defaultLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Journal", href: "/journal" },
  { label: "About us", href: "/about" },
];

const NavbarSection = ({
  links = defaultLinks,
  transparent = false,
}: NavbarSectionProps) => {
  const [open, setOpen] = useState(false);

  const textColor = transparent ? "text-white" : "text-black";
  const mutedColor = transparent ? "text-white/80" : "text-gray-500";
  const hoverColor = transparent ? "hover:text-white" : "hover:text-black";
  const bg = transparent
    ? "bg-transparent"
    : "bg-white border-b border-gray-100";

  return (
    <header className={`relative w-full z-20 py-4 ${bg}`}>
      <div className="flex items-center justify-between px-5 md:px-10 py-5">
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className={`text-sm font-medium ${textColor}`}
          >
            Menu
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className={`text-xl font-semibold tracking-tight ${textColor}`}>
            Logo
          </div>
          <nav className="hidden md:block">
            <ul className={`flex gap-8 text-sm ${mutedColor}`}>
              {links.map((link) => (
                <li
                  key={link.href}
                  className={`${hoverColor} cursor-pointer transition`}
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ml-auto">
          <ul className={`flex gap-6 text-sm ${mutedColor}`}>
            <li className={`${hoverColor} cursor-pointer transition`}>
              Search
            </li>
            <li className={`${hoverColor} cursor-pointer transition`}>Cart</li>
            <li className={`${hoverColor} cursor-pointer transition`}>
              Account
            </li>
          </ul>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5">
          <ul className={`flex flex-col gap-4 text-sm ${textColor}`}>
            {links.map((link) => (
              <li key={link.href}>{link.label}</li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavbarSection;
