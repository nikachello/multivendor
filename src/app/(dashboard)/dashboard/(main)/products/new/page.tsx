"use server";

import { getCategoriesByShop, getShopBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import ProductForm from "./ProductForm";

const page = async () => {
  const SHOP_SLUG = "niko-watches";

  const shopResult = await getShopBySlug(SHOP_SLUG);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const categoriesResult = await getCategoriesByShop(shop.id);
  const categories = categoriesResult.ok ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
      <ProductForm shopId={shop.id} categories={categories} />
    </div>
  );
};

export default page;
