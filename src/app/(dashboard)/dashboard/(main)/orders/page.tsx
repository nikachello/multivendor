import { getShop } from "@/lib/auth/get-shop";
import { getOrdersByShop } from "@/lib/db/queries";
import OrdersTable from "./OrdersTable";
import SearchInput from "@/components/dashboard/SearchInput";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import StatusFilter from "./StatusFilter";

const PAGE_SIZE = 20;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const shop = await getShop();
  const result = await getOrdersByShop(shop.id, { q, status, page, pageSize: PAGE_SIZE });
  const { data: orders, total } = result.ok ? result.data : { data: [], total: 0 };
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">{total} total</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <SearchInput defaultValue={q} placeholder="Search by order ID or email…" className="flex-1 min-w-48" />
        <StatusFilter value={status ?? ""} />
      </div>

      <OrdersTable orders={orders} currency={shop.currency ?? "GEL"} />

      <DashboardPagination page={page} totalPages={totalPages} searchParams={sp} />
    </div>
  );
}
