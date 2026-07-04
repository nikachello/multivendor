import Link from "next/link";
import { getProductsByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { notFound } from "next/navigation";
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
  if (!result.ok) return notFound();

  const { data: products, total } = result.data;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} total</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all"
        >
          + New product
        </Link>
      </div>

      <SearchInput defaultValue={q} placeholder="Search products…" className="max-w-xs" />

      <ProductsTable products={products} currency={shop.currency} />

      <DashboardPagination page={page} totalPages={totalPages} searchParams={sp} />
    </div>
  );
}
