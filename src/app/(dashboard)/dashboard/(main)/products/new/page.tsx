import { getCategoriesByShop } from "@/lib/db/queries";
import { getShop } from "@/lib/auth/get-shop";
import ProductForm from "./ProductForm";
import Breadcrumb from "@/components/dashboard/Breadcrumb";
import { isProShop, FREE_PRODUCT_LIMIT } from "@/lib/subscription";
import prisma from "@/lib/db/prisma";

const page = async () => {
  const shop = await getShop();

  if (!isProShop(shop.subscriptionPaidUntil)) {
    const count = await prisma.product.count({ where: { shopId: shop.id } });
    if (count >= FREE_PRODUCT_LIMIT) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
          <p className="text-sm text-zinc-500">You&apos;ve reached the {FREE_PRODUCT_LIMIT}-product limit on the free plan.</p>
          <a href="/dashboard/billing" className="text-sm font-medium text-zinc-900 underline underline-offset-4">
            Upgrade to Pro →
          </a>
        </div>
      );
    }
  }

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
