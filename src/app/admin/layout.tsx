import { assertAdmin } from "@/lib/auth/assert-admin";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await assertAdmin();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-zinc-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold tracking-widest uppercase">Admin</span>
          <nav className="flex items-center gap-4 text-xs text-zinc-400">
            <Link href="/admin" className="hover:text-white transition-colors">Overview</Link>
            <Link href="/admin/shops" className="hover:text-white transition-colors">Shops</Link>
            <Link href="/admin/users" className="hover:text-white transition-colors">Users</Link>
          </nav>
        </div>
        <span className="text-xs text-zinc-500">{session.user.email}</span>
      </header>
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
