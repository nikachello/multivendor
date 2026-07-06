"use client";

import Link from "next/link";
import { OrderStatus } from "@/generated/prisma/client";
import { useT } from "@/i18n/context";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  refunded: "bg-red-50 text-red-500",
};

type Order = {
  id: string;
  customerEmail: string | null;
  customerPhone: string | null;
  total: { toString(): string } | number | string;
  status: OrderStatus;
  createdAt: Date;
  items: unknown[];
};

type Props = {
  orders: Order[];
  currency: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function OrdersTable({ orders, currency }: Props) {
  const t = useT();
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left">
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_order")}</th>
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_customer")}</th>
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_items")}</th>
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_total")}</th>
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_status")}</th>
            <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t("dashboard.orders.col_date")}</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                {t("dashboard.orders.no_orders")}
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                  {order.customerEmail ?? order.customerPhone ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {order.items.length} {order.items.length === 1 ? t("dashboard.orders.item") : t("dashboard.orders.items")}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {currency} {Number(order.total).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLES[order.status]}`}>
                    {t(`dashboard.orders.status_${order.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/dashboard/orders/${order.id}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {t("dashboard.orders.view")}
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
