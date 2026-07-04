import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; shopId?: string }>;
}) {
  await assertAdmin();
  const { q, shopId } = await searchParams;

  const where = {
    ...(shopId ? { shopId } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: "insensitive" as const } },
            { customerEmail: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      shop: { select: { name: true, slug: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">Search across all shops.</p>
      </div>

      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by order ID, customer email or name..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm"
          autoComplete="off"
        />
        {shopId && <input type="hidden" name="shopId" value={shopId} />}
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all"
        >
          Search
        </button>
        {(q || shopId) && (
          <Link
            href="/admin/orders"
            className="px-4 py-2 border border-gray-200 text-[13px] text-gray-500 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      {shopId && (
        <p className="text-xs text-gray-400">
          Filtered by shop. <Link href="/admin/orders" className="underline">Show all</Link>
        </p>
      )}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Shop</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700">{order.shop.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{order.shop.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {order.customerEmail ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">
                      ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLES[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.createdAt))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
