"use client";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-20 text-white py-4">
      <div className="flex items-center justify-between px-5 md:px-10 py-5">
        {/* LEFT (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-sm font-medium"
          >
            Menu
          </button>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="text-xl font-semibold tracking-tight">Logo</div>

          <nav className="hidden md:block">
            <ul className="flex gap-8 text-sm text-white/80">
              <li className="hover:text-white cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Shop
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Journal
              </li>
              <li className="hover:text-white cursor-pointer transition">
                About us
              </li>
            </ul>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="ml-auto">
          <ul className="flex gap-6 text-sm text-white/80">
            <li className="hover:text-white cursor-pointer transition">
              Search
            </li>
            <li className="hover:text-white cursor-pointer transition">Cart</li>
            <li className="hover:text-white cursor-pointer transition">
              Account
            </li>
          </ul>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-5 pb-5">
          <ul className="flex flex-col gap-4 text-sm text-white">
            <li>Home</li>
            <li>Shop</li>
            <li>Journal</li>
            <li>About us</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
