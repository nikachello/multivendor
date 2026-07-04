import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { getStorefrontUrl } from "@/lib/storefront-url";
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

export default async function AdminShopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await assertAdmin();
  const { id } = await params;

  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { products: true, orders: true, categories: true } },
    },
  });

  if (!shop) notFound();

  const [recentOrders, revenue] = await Promise.all([
    prisma.order.findMany({
      where: { shopId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.order.aggregate({
      where: { shopId: id },
      _sum: { total: true },
    }),
  ]);

  const totalRevenue = Number(revenue._sum.total ?? 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/shops" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-900">{shop.name}</h1>
            {!shop.isActive && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-medium">Inactive</span>
            )}
          </div>
          <p className="text-sm text-gray-400 font-mono mt-0.5">{shop.slug}</p>
        </div>
        <a
          href={getStorefrontUrl(shop.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Storefront
        </a>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Products", value: shop._count.products },
          { label: "Categories", value: shop._count.categories },
          { label: "Orders", value: shop._count.orders },
          { label: "Revenue", value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Owner + settings */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Owner</p>
          <p className="font-medium text-gray-800">{shop.owner.name}</p>
          <p className="text-gray-400 text-xs">{shop.owner.email}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Theme</p>
          <p className="text-gray-700 capitalize">{shop.themeId}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Currency</p>
          <p className="text-gray-700">{shop.currency}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Custom Domain</p>
          {shop.customDomain ? (
            <p className={`text-xs font-medium ${shop.domainVerified ? "text-green-700" : "text-amber-600"}`}>
              {shop.customDomain} {shop.domainVerified ? "(verified)" : "(pending)"}
            </p>
          ) : (
            <p className="text-gray-400 text-xs">None</p>
          )}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">Created</p>
          <p className="text-gray-700 text-xs">
            {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(shop.createdAt))}
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400">Recent Orders</p>
          <Link
            href={`/admin/orders?shopId=${shop.id}`}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-8 text-center">
            <p className="text-sm text-gray-400">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{order.customerEmail}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLES[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(order.createdAt))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
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
