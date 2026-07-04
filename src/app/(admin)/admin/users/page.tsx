import { assertAdmin } from "@/lib/auth/assert-admin";
import prisma from "@/lib/db/prisma";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-red-50 text-red-700",
  seller: "bg-blue-50 text-blue-700",
  customer: "bg-gray-100 text-gray-500",
};

export default async function AdminUsersPage() {
  await assertAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      shops: { select: { id: true, name: true, slug: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
        <p className="text-sm text-gray-400 mt-0.5">{users.length} registered accounts.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Verified</th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Shop</th>
              <th className="px-4 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-400">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${ROLE_STYLES[user.role] ?? "bg-gray-100 text-gray-500"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.emailVerified ? (
                    <span className="text-[11px] text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-[11px] text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.shops[0] ? (
                    <div>
                      <p className="text-xs text-gray-700">{user.shops[0].name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{user.shops[0].slug}</p>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-300">No shop</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(user.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
