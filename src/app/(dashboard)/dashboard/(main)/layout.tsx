import Link from "next/link";
import LogoutButton from "@/components/dashboard/LogoutButton";

const NAV_ITEMS = [
  { label: "Products", href: "/dashboard/products" },
  { label: "Categories", href: "/dashboard/categories" },
  { label: "Navigation", href: "/dashboard/navigation" },
  { label: "Editor", href: "/dashboard/editor" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <nav className="flex flex-col bg-gray-100 border-r border-gray-200 p-6 w-52 shrink-0">
        <div className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 overflow-y-auto p-10">{children}</div>
    </div>
  );
}
