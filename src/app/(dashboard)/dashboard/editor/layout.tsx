import Link from "next/link";
import { getShop } from "@/lib/auth/get-shop";
import { getStorefrontUrl } from "@/lib/storefront-url";

export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  const shop = await getShop();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-5 h-12 border-b border-gray-200 bg-white shrink-0 text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Dashboard
        </Link>
        <span className="font-medium text-gray-900">{shop.name}</span>
        <a
          href={getStorefrontUrl(shop.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          View Store ↗
        </a>
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
