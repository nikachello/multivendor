import { getShop } from "@/lib/auth/get-shop";
import { getProductsByShop, getCategoriesByShop } from "@/lib/db/queries";
import { Package, Tag, ShoppingBag, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const shop = await getShop();

  const [productsResult, categoriesResult] = await Promise.all([
    getProductsByShop(shop.id),
    getCategoriesByShop(shop.id),
  ]);

  const productCount = productsResult.ok ? productsResult.data.length : 0;
  const categoryCount = categoriesResult.ok ? categoriesResult.data.length : 0;

  const stats = [
    { label: "Products", value: productCount, icon: Package, href: "/dashboard/products" },
    { label: "Categories", value: categoryCount, icon: Tag, href: "/dashboard/categories" },
    { label: "Orders", value: 0, icon: ShoppingBag, href: "#" },
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">{shop.name}</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's going on with your store.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="group bg-white border border-gray-100 rounded-lg p-5 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gray-50 rounded-md">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-3">
          Quick actions
        </p>
        <div className="flex gap-3">
          <a
            href="/dashboard/products/new"
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            + New product
          </a>
          <a
            href="/dashboard/categories/new"
            className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            + New category
          </a>
          <a
            href={`/shop/${shop.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            View store ↗
          </a>
        </div>
      </div>
    </div>
  );
}
