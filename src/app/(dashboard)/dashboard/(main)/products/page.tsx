import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.products.title };
}
import ProductsTable from "./ProductsTable";
import SearchInput from "@/components/dashboard/SearchInput";
import DashboardPagination from "@/components/dashboard/DashboardPagination";

const PAGE_SIZE = 20;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const shop = await getShop();
  const result = await getProductsByShop(shop.id, { q, page, pageSize: PAGE_SIZE });

  const products = result.ok ? result.data.data : [];
  const total = result.ok ? result.data.total : 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const d = await getDict();
  const t = d.dashboard.products;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} {t.total}</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all"
        >
          {t.new_product}
        </Link>
      </div>

      <SearchInput defaultValue={q} placeholder={t.search_placeholder} className="max-w-xs" />

      <ProductsTable products={products} currency={shop.currency} />

      <DashboardPagination page={page} totalPages={totalPages} searchParams={sp} />
    </div>
  );
}
