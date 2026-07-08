import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { isProShop } from "@/lib/subscription";
import Link from "next/link";

export const metadata = { title: "Admin — Shops" };

export default async function AdminShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; plan?: string }>;
}) {
  await assertAdmin();
  const { q, plan } = await searchParams;

  const shops = await prisma.shop.findMany({
    where: {
      ...(q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { owner: { email: { contains: q, mode: "insensitive" } } },
        ],
      } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      subscriptionPaidUntil: true,
      createdAt: true,
      paymentConfig: true,
      owner: { select: { email: true, name: true } },
      _count: { select: { products: true, orders: true } },
    },
  });

  const filtered = plan === "pro"
    ? shops.filter((s) => isProShop(s.subscriptionPaidUntil))
    : plan === "free"
      ? shops.filter((s) => !isProShop(s.subscriptionPaidUntil))
      : shops;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Shops <span className="text-zinc-400 text-sm font-normal ml-1">{filtered.length} total</span></h1>
      </div>

      <div className="flex gap-3">
        <form className="flex-1">
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name, slug, or owner email…"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 transition-colors"
          />
        </form>
        <div className="flex gap-1">
          {[
            { label: "All", value: undefined },
            { label: "Pro", value: "pro" },
            { label: "Free", value: "free" },
          ].map(({ label, value }) => (
            <Link
              key={label}
              href={value ? `/admin/shops?plan=${value}${q ? `&q=${q}` : ""}` : `/admin/shops${q ? `?q=${q}` : ""}`}
              className={`px-3 py-2 text-xs rounded-lg border transition-colors ${plan === value || (!plan && !value) ? "bg-zinc-900 text-white border-zinc-900" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["Shop", "Owner", "Plan", "Payments", "Products", "Orders", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-xs font-medium text-zinc-500 tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map((shop) => (
              <tr key={shop.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/shops/${shop.id}`} className="font-medium text-zinc-900 hover:underline">{shop.name}</Link>
                  <p className="text-zinc-400 text-xs font-mono">{shop.slug}</p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{shop.owner.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isProShop(shop.subscriptionPaidUntil) ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {isProShop(shop.subscriptionPaidUntil) ? "Pro" : "Free"}
                    {shop.subscriptionPaidUntil && (
                      <span className="ml-1 opacity-60">· {new Date(shop.subscriptionPaidUntil).toLocaleDateString()}</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {(() => {
                    const cfg = (shop.paymentConfig as Record<string, { enabled?: boolean }>) ?? {};
                    const enabled = Object.entries(cfg).filter(([, v]) => v?.enabled).map(([k]) => k.toUpperCase());
                    return enabled.length > 0
                      ? <span className="text-xs text-green-600">{enabled.join(", ")}</span>
                      : <span className="text-xs text-zinc-300">—</span>;
                  })()}
                </td>
                <td className="px-4 py-3 text-zinc-500">{shop._count.products}</td>
                <td className="px-4 py-3 text-zinc-500">{shop._count.orders}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${shop.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {shop.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/shops/${shop.id}`} className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400 text-sm">No shops found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
