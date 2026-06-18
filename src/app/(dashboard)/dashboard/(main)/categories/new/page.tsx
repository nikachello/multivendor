import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/db/queries";
import CategoryForm from "../CategoryForm";

const SHOP_SLUG = "niko-watches";

export default async function NewCategoryPage() {
  const shopResult = await getShopBySlug(SHOP_SLUG);
  if (!shopResult.ok) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">New Category</h1>
      <CategoryForm shopId={shopResult.data.id} />
    </div>
  );
}
