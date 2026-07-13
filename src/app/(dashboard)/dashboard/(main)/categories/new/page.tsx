import { getShop } from "@/lib/auth/get-shop";
import { getCategoriesByShop } from "@/lib/db/queries";
import CategoryForm from "../CategoryForm";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default async function NewCategoryPage() {
  const shop = await getShop();
  const categoriesResult = await getCategoriesByShop(shop.id);
  const allCategories = (categoriesResult.ok ? categoriesResult.data : []).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Categories", href: "/dashboard/categories" }, { label: "New Category" }]} />
      <h1 className="text-2xl font-semibold text-gray-900">New Category</h1>
      <CategoryForm shopId={shop.id} allCategories={allCategories} />
    </div>
  );
}
