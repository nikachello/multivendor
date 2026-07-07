import { notFound } from "next/navigation";
import { getCategoriesByShop, getProductWithOptions } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import { getDict } from "@/i18n";
import ProductEditTabs from "./ProductEditTabs";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [shop, d] = await Promise.all([getShop(), getDict()]);

  const [product, categoriesResult] = await Promise.all([
    getProductWithOptions(id),
    getCategoriesByShop(shop.id),
  ]);

  if (!product || product.shopId !== shop.id) notFound();
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: d.dashboard.sidebar.products, href: "/dashboard/products" }, { label: product.name }]} />
      <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
      <ProductEditTabs
        product={product}
        shop={shop}
        categories={categories}
      />
    </div>
  );
}
