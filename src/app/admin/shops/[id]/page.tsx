import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { isProShop } from "@/lib/subscription";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminShopActions from "./AdminShopActions";

export const metadata = { title: "Admin — Shop Detail" };

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
      owner: { select: { id: true, email: true, name: true, createdAt: true } },
      _count: { select: { products: true, orders: true, categories: true } },
    },
  });

  if (!shop) notFound();

  const recentOrders = await prisma.order.findMany({
    where: { shopId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, customerEmail: true, total: true, status: true, createdAt: true },
  });

  const revenue = await prisma.order.aggregate({ where: { shopId: id }, _sum: { total: true } });
  const isPro = isProShop(shop.subscriptionPaidUntil);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/admin/shops" className="hover:text-zinc-700 transition-colors">Shops</Link>
        <span>/</span>
        <span className="text-zinc-700">{shop.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">{shop.name}</h1>
                <p className="text-sm text-zinc-400 font-mono mt-0.5">{shop.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${isPro ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600"}`}>
                  {isPro ? "Pro" : "Free"}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${shop.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {shop.isActive ? "Active" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              {[
                { label: "Owner", value: shop.owner.email },
                { label: "Currency", value: shop.currency },
                { label: "Products", value: shop._count.products },
                { label: "Categories", value: shop._count.categories },
                { label: "Orders", value: shop._count.orders },
                { label: "Revenue", value: `${Number(revenue._sum.total ?? 0).toFixed(2)}` },
                {
                  label: "Payments",
                  value: (() => {
                    const cfg = (shop.paymentConfig as Record<string, { enabled?: boolean }>) ?? {};
                    const enabled = Object.entries(cfg).filter(([, v]) => v?.enabled).map(([k]) => k.toUpperCase());
                    return enabled.length > 0 ? enabled.join(", ") : "None";
                  })(),
                },
                { label: "Custom Domain", value: shop.customDomain ?? "None" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-zinc-400 tracking-widest uppercase">{label}</p>
                  <p className="text-sm text-zinc-700 mt-0.5">{String(value)}</p>
                </div>
              ))}
            </div>

            {isPro && shop.subscriptionPaidUntil && (
              <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-100">
                Pro expires: {new Date(shop.subscriptionPaidUntil).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Recent orders */}
          {recentOrders.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100">
                <h2 className="text-sm font-semibold text-zinc-700">Recent Orders</h2>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    {["ID", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-2 text-xs font-medium text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500">#{order.id.slice(-8)}</td>
                      <td className="px-4 py-2 text-xs text-zinc-500">{order.customerEmail}</td>
                      <td className="px-4 py-2 text-xs">{Number(order.total).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full capitalize">{order.status}</span>
                      </td>
                      <td className="px-4 py-2 text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions sidebar */}
        <AdminShopActions
          shopId={shop.id}
          isActive={shop.isActive}
          isPro={isPro}
          subscriptionPaidUntil={shop.subscriptionPaidUntil?.toISOString() ?? null}
        />
      </div>
    </div>
  );
}
