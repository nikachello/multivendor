import Link from "next/link";
import { getProductsByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { notFound } from "next/navigation";
import ProductsTable from "./ProductsTable";

const page = async () => {
  const shop = await getShop();
  const result = await getProductsByShop(shop.id);

  if (!result.ok) return notFound();

  const products = result.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">პროდუქცია</h1>
        <Link
          href="/dashboard/products/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
        >
          ახალი პროდუქტი
        </Link>
      </div>
      <ProductsTable products={products} currency={shop.currency} />
    </div>
  );
};

export default page;
