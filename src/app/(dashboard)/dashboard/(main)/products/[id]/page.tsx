import { notFound } from "next/navigation";
import { getCategoriesByShop, getProductWithOptions } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import ProductForm from "../new/ProductForm";
import ProductEditTabs from "./ProductEditTabs";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShop();

  const [product, categoriesResult] = await Promise.all([
    getProductWithOptions(id),
    getCategoriesByShop(shop.id),
  ]);

  if (!product) notFound();
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
      <ProductEditTabs
        product={product}
        shop={shop}
        categories={categories}
      />
    </div>
  );
}
