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
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Navigation", href: "/dashboard/navigation", icon: Navigation },
  { label: "Themes", href: "/dashboard/themes", icon: Paintbrush },
  { label: "Editor", href: "/dashboard/editor", icon: Layout },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type Props = {
  shopName: string;
  shopSlug: string;
};

export default function Sidebar({ shopName, shopSlug }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 h-screen">
      {/* Shop header */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-bold uppercase">
              {shopName.charAt(0)}
            </span>
          </div>
          <Link href={"/dashboard"}>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {shopName}
              </p>
              <p className="text-[10px] text-gray-400 truncate">Dashboard</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-medium tracking-widest uppercase text-gray-400">
          Manage
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? "text-gray-900" : "text-gray-400"}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <a
          href={`/shop/${shopSlug}`}
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
    </aside>
  );
}
