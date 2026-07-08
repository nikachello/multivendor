import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";
import { isProShop } from "@/lib/subscription";
import Link from "next/link";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await assertAdmin();
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q ? {
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    } : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      shops: {
        select: { id: true, name: true, slug: true, subscriptionPaidUntil: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">
          Users <span className="text-zinc-400 text-sm font-normal ml-1">{users.length} total</span>
        </h1>
      </div>

      <form>
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or email…"
          className="w-full max-w-sm border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-400 transition-colors"
        />
      </form>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              {["User", "Role", "Verified", "Shops", "Joined"].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-xs font-medium text-zinc-500 tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{user.name}</p>
                  <p className="text-xs text-zinc-400">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.role === "admin" ? "bg-red-100 text-red-700" :
                    user.role === "seller" ? "bg-blue-100 text-blue-700" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${user.emailVerified ? "text-green-600" : "text-zinc-400"}`}>
                    {user.emailVerified ? "✓ Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {user.shops.map((shop) => (
                      <Link key={shop.id} href={`/admin/shops/${shop.id}`} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                        {shop.name}
                        {isProShop(shop.subscriptionPaidUntil) && (
                          <span className="ml-1 text-violet-600 font-medium">Pro</span>
                        )}
                      </Link>
                    ))}
                    {user.shops.length === 0 && <span className="text-xs text-zinc-300">No shops</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-400 text-sm">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
