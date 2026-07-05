export const dynamic = "force-dynamic";

import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { Store, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default async function AdminOverviewPage() {
  await assertAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalShops,
    totalUsers,
    totalOrders,
    revenueResult,
    newShops30d,
    newOrders30d,
    recentShops,
  ] = await Promise.all([
    prisma.shop.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.shop.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        owner: { select: { email: true } },
        _count: { select: { orders: true, products: true } },
      },
    }),
  ]);

  const totalRevenue = Number(revenueResult._sum.total ?? 0);

  const stats = [
    { label: "Total Shops", value: totalShops, sub: `+${newShops30d} this month`, icon: Store, color: "text-blue-600 bg-blue-50" },
    { label: "Total Users", value: totalUsers, sub: "registered accounts", icon: Users, color: "text-purple-600 bg-purple-50" },
    { label: "Total Orders", value: totalOrders, sub: `+${newOrders30d} this month`, icon: ShoppingBag, color: "text-amber-600 bg-amber-50" },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: "across all shops", icon: TrendingUp, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Platform-wide metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} mb-4`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            <p className="text-[11px] text-gray-300 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-3">
          Recently created shops
        </p>
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Shop</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Products</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-gray-900">{shop.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{shop.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{shop.owner.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{shop._count.products}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{shop._count.orders}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(shop.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
