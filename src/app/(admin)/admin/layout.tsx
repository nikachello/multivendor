import { assertAdmin } from "@/lib/auth/assert-admin";
import Link from "next/link";
import { LayoutDashboard, Store, Users, ShoppingBag } from "lucide-react";

const NAV = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/shops", label: "Shops", icon: Store },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await assertAdmin();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-semibold text-gray-900 tracking-tight">
              Platform Admin
            </span>
            <nav className="flex items-center gap-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <Link
            href="/dashboard"
            className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
