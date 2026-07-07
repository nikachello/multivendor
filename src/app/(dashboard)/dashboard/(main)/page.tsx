import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import { getDashboardStats } from "@/lib/db/queries";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.sidebar.label };
}
import {
  Package,
  Tag,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@/generated/prisma/client";
import { getStorefrontUrl } from "@/lib/storefront-url";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  refunded: "bg-red-50 text-red-500",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function DashboardPage() {
  const shop = await getShop();
  const stats = await getDashboardStats(shop.id);
  const d = await getDict();
  const t = d.dashboard;

  const cards = [
    {
      label: t.overview.products,
      value: stats.productCount,
      icon: Package,
      href: "/dashboard/products",
    },
    {
      label: t.overview.categories,
      value: stats.categoryCount,
      icon: Tag,
      href: "/dashboard/categories",
    },
    {
      label: t.overview.orders,
      value: stats.orderCount,
      icon: ShoppingBag,
      href: "/dashboard/orders",
    },
    {
      label: t.overview.revenue,
      value: `${shop.currency} ${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      href: "/dashboard/orders",
    },
  ];

  return (
    <div className="max-w-4xl flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{shop.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {t.overview.subtitle}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-md transition-all shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900 truncate">
              {value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
            {t.overview.recent_orders}
          </p>
          <Link
            href="/dashboard/orders"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {t.overview.view_all}
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-lg py-10 text-center">
            <p className="text-sm text-gray-400">{t.overview.no_orders}</p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {t.overview.col_order}
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {t.overview.col_customer}
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {t.overview.col_total}
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {t.overview.col_status}
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {t.overview.col_date}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs truncate max-w-[140px]">
                      {order.customerEmail ?? (
                        <span className="text-gray-300"></span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {shop.currency} {Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {t.overview.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-3">
          {t.overview.quick_actions}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/products/new"
            className="px-3 py-1.5 text-[13px] font-medium bg-gray-900 text-white rounded-lg shadow-sm hover:bg-gray-800 transition-all"
          >
            {t.overview.new_product}
          </Link>
          <Link
            href="/dashboard/categories/new"
            className="px-3 py-1.5 text-[13px] font-medium bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            {t.overview.new_category}
          </Link>
          <a
            href={getStorefrontUrl(shop.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-[13px] font-medium bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            {t.overview.view_store}
          </a>
        </div>
      </div>
    </div>
  );
}
