"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#how", label: "როგორ მუშაობს" },
  { href: "#features", label: "ფუნქციები" },
  { href: "#pricing", label: "ფასები" },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{ background: "#fcfbf9", borderBottom: "1px solid #e7e3da" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight"
          style={{ color: "#1c1a17" }}
        >
          MultiStore
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm transition-colors"
              style={{ color: "#78716c" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1c1a17")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm transition-colors"
            style={{ color: "#78716c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1c1a17")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
          >
            შესვლა
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium"
            style={{ background: "#1c1a17", color: "#fcfbf9" }}
          >
            დაიწყე უფასოდ
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-1"
          style={{ color: "#1c1a17" }}
          aria-label="Menu"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 pt-4 pb-5 flex flex-col gap-4"
          style={{ borderTop: "1px solid #e7e3da", background: "#fcfbf9" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm"
              style={{ color: "#1c1a17" }}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <div style={{ borderTop: "1px solid #e7e3da" }} className="pt-3 flex flex-col gap-3">
            <Link href="/login" className="text-sm" style={{ color: "#78716c" }} onClick={() => setOpen(false)}>
              შესვლა
            </Link>
            <Link
              href="/register"
              className="px-4 py-2.5 text-sm font-medium text-center"
              style={{ background: "#1c1a17", color: "#fcfbf9" }}
              onClick={() => setOpen(false)}
            >
              დაიწყე უფასოდ
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
