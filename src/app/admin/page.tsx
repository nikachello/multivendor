import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { isProShop } from "@/lib/subscription";
import Link from "next/link";

export const metadata = { title: "Admin — Overview" };

export default async function AdminOverviewPage() {
  await assertAdmin();

  const [totalShops, totalUsers, totalOrders, revenueResult, activeProShops] = await Promise.all([
    prisma.shop.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.shop.findMany({ select: { subscriptionPaidUntil: true } }).then(
      (shops) => shops.filter((s) => isProShop(s.subscriptionPaidUntil)).length
    ),
  ]);

  const recentShops = await prisma.shop.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      subscriptionPaidUntil: true,
      createdAt: true,
      owner: { select: { email: true } },
    },
  });

  const stats = [
    { label: "Total Shops", value: totalShops },
    { label: "Pro Shops", value: activeProShops },
    { label: "Total Users", value: totalUsers },
    { label: "Total Orders", value: totalOrders },
    { label: "Total Revenue", value: `${Number(revenueResult._sum.total ?? 0).toFixed(2)}` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900">Platform Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-zinc-200 rounded-lg px-5 py-4">
            <p className="text-xs text-zinc-400 tracking-widest uppercase">{s.label}</p>
            <p className="text-2xl font-semibold text-zinc-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-700">Recent Shops</h2>
          <Link href="/admin/shops" className="text-xs text-zinc-400 hover:text-zinc-700 underline">View all</Link>
        </div>
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {["Shop", "Owner", "Plan", "Active", "Created"].map((h) => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-medium text-zinc-500 tracking-widest uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/shops/${shop.id}`} className="font-medium text-zinc-900 hover:underline">{shop.name}</Link>
                    <span className="text-zinc-400 ml-2 text-xs font-mono">{shop.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{shop.owner.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isProShop(shop.subscriptionPaidUntil) ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600"}`}>
                      {isProShop(shop.subscriptionPaidUntil) ? "Pro" : "Free"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${shop.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {shop.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(shop.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
