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
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} total</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all"
        >
          + New product
        </Link>
      </div>
      <ProductsTable products={products} currency={shop.currency} />
    </div>
  );
};

export default page;
