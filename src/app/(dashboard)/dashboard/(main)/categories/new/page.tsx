import { getShop } from "@/lib/auth/get-shop";
import CategoryForm from "../CategoryForm";

export default async function NewCategoryPage() {
  const shop = await getShop();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">New Category</h1>
      <CategoryForm shopId={shop.id} />
    </div>
  );
}
