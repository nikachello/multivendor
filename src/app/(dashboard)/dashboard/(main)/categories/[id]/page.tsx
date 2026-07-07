import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import CategoryForm from "../CategoryForm";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await getShop();

  const categoryResult = await getCategoryById(id);
  if (!categoryResult.ok) notFound();
  const category = categoryResult.data;
  if (!category || category.shopId !== shop.id) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Categories", href: "/dashboard/categories" }, { label: category.name }]} />
      <h1 className="text-2xl font-semibold text-gray-900">{category.name}</h1>
      <CategoryForm
        shopId={shop.id}
        categoryId={category.id}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
