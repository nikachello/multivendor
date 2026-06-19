import { getShop } from "@/lib/auth/get-shop";

export default async function DashboardPage() {
  const shop = await getShop();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{shop.name}</h1>
      <p className="text-sm text-gray-500 mt-1">Welcome back.</p>
    </div>
  );
}
