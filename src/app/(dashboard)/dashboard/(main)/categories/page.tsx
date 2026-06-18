import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesByShop, getShopBySlug } from "@/lib/db/queries";
import CategoriesTable from "./CategoriesTable";

const SHOP_SLUG = "niko-watches";

export default async function CategoriesPage() {
  const shopResult = await getShopBySlug(SHOP_SLUG);
  if (!shopResult.ok) notFound();

  const result = await getCategoriesByShop(shopResult.data.id);
  const categories = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <Link
          href="/dashboard/categories/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors"
        >
          New Category
        </Link>
      </div>
      <CategoriesTable categories={categories} />
    </div>
  );
}
