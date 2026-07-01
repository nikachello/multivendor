"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Tag,
  Navigation,
  Layout,
  Store,
  LogOut,
  ShoppingBag,
  Settings,
  Paintbrush,
  Earth,
  BarChart2,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { getStorefrontUrl } from "@/lib/storefront-url";

const NAV_GROUPS = [
  {
    label: "Manage",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package },
      { label: "Categories", href: "/dashboard/categories", icon: Tag },
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Themes", href: "/dashboard/themes", icon: Paintbrush },
      { label: "Editor", href: "/dashboard/editor", icon: Layout },
      { label: "Navigation", href: "/dashboard/navigation", icon: Navigation },
      { label: "Shipping", href: "/dashboard/shipping", icon: Earth },
    ],
  },
  {
    label: "More",
    items: [
      { label: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

type Props = {
  shopName: string;
  shopSlug: string;
};

export default function Sidebar({ shopName, shopSlug }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const sidebarContent = (
    <>
      {/* Shop header */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-bold uppercase">
              {shopName.charAt(0)}
            </span>
          </div>
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{shopName}</p>
              <p className="text-[10px] text-gray-400">Dashboard</p>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-medium tracking-widest uppercase text-gray-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-gray-900" : "text-gray-400"}`} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <a
          href={getStorefrontUrl(shopSlug)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Store className="w-4 h-4 shrink-0 text-gray-400" />
          View Store
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 text-gray-400" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden flex items-center justify-center w-9 h-9 bg-white border border-gray-200 rounded-md shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar — always visible, part of flex flow */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — fixed overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-100 shadow-xl transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
