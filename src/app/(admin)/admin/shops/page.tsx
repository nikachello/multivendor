import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { ExternalLink } from "lucide-react";
import { getStorefrontUrl } from "@/lib/storefront-url";
import { setShopActive } from "@/lib/actions/admin";
import Link from "next/link";

export default async function AdminShopsPage() {
  await assertAdmin();

  const shops = await prisma.shop.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { email: true, name: true } },
      _count: { select: { orders: true, products: true } },
    },
  });

  const revenues = await prisma.order.groupBy({
    by: ["shopId"],
    _sum: { total: true },
  });
  const revenueMap = Object.fromEntries(revenues.map((r) => [r.shopId, Number(r._sum.total ?? 0)]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Shops</h1>
        <p className="text-sm text-gray-400 mt-0.5">{shops.length} shops on the platform.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Shop</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Products</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Domain</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shops.map((shop) => (
                <tr key={shop.id} className={`hover:bg-gray-50 transition-colors ${!shop.isActive ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-gray-900">{shop.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{shop.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-700">{shop.owner.name}</p>
                    <p className="text-[11px] text-gray-400">{shop.owner.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{shop._count.products}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{shop._count.orders}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-700">
                    ${(revenueMap[shop.id] ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    {shop.customDomain ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${shop.domainVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${shop.domainVerified ? "bg-green-500" : "bg-amber-400"}`} />
                        {shop.customDomain}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-300">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <form action={async () => {
                      "use server";
                      await setShopActive(shop.id, !shop.isActive);
                    }}>
                      <button
                        type="submit"
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors ${
                          shop.isActive
                            ? "text-red-600 border-red-100 hover:bg-red-50"
                            : "text-green-700 border-green-100 hover:bg-green-50"
                        }`}
                      >
                        {shop.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(shop.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/shops/${shop.id}`}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        Details
                      </Link>
                      <a
                        href={getStorefrontUrl(shop.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Store
                      </a>
                    </div>
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
