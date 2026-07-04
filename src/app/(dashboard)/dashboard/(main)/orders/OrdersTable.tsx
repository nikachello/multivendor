"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OrderStatus } from "@/generated/prisma/client";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  refunded: "bg-red-50 text-red-500",
};

const ALL_STATUSES = Object.keys(STATUS_STYLES) as OrderStatus[];

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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.customerEmail ?? "").toLowerCase().includes(q) ||
          (o.customerPhone ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [orders, query, statusFilter]);

  return (
    <div className="flex flex-col gap-3">
      {orders.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or email€¦"
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm flex-1 min-w-48 bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatus | "")
            }
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  {query || statusFilter
                    ? "No orders match your filter."
                    : "No orders yet. Orders will appear here once customers check out."}
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                    {order.customerEmail ?? order.customerPhone ?? (
                      <span className="text-gray-300"></span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {currency} {Number(order.total).toFixed(2)}
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
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
