import Link from "next/link";
import { getCategoriesByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import CategoriesTable from "./CategoriesTable";

export default async function CategoriesPage() {
  const shop = await getShop();

  const result = await getCategoriesByShop(shop.id);
  const categories = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">{categories.length} total</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
        >
          + New category
        </Link>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
