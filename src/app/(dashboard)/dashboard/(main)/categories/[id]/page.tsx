import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import CategoryForm from "../CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShop();

  const categoryResult = await getCategoryById(id);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{category.name}</h1>
      <CategoryForm
        shopId={shop.id}
        categoryId={category.id}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
