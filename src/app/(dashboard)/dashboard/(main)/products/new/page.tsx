import { getCategoriesByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import ProductForm from "./ProductForm";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

const page = async () => {
  const shop = await getShop();

  const categoriesResult = await getCategoriesByShop(shop.id);
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Products", href: "/dashboard/products" }, { label: "New Product" }]} />
      <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
      <ProductForm shopId={shop.id} categories={categories} currency={shop.currency} />
    </div>
  );
};

export default page;
