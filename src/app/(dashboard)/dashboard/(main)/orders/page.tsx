import { getShop } from "@/lib/auth/get-shop";
import { getOrdersByShop } from "@/lib/db/queries";
import OrdersTable from "./OrdersTable";

export default async function OrdersPage() {
  const shop = await getShop();
  const result = await getOrdersByShop(shop.id);
  const orders = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} total</p>
      </div>
      <OrdersTable orders={orders} currency={shop.currency ?? "GEL"} />
    </div>
  );
}
