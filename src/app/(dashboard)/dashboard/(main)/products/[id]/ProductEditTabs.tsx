"use client";

import { useRouter } from "next/navigation";
import { Category, Shop } from "@/generated/prisma/client";
import { ProductOptionType } from "@/lib/db/queries";
import { ProductWithRelations } from "@/lib/db/queries";
import ProductForm from "../new/ProductForm";
import OptionsEditor from "./OptionsEditor";
import VariantsEditor from "./VariantsEditor";
import ImagesEditor from "./ImagesEditor";

type Props = {
  product: ProductWithRelations & { optionTypes: ProductOptionType[] };
  shop: Shop;
  categories: Category[];
};

export default function ProductEditTabs({ product, shop, categories }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      {/* Simple manual tab state using URL hash would be cleaner but for now two sections */}
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-2">
            Details
          </h2>
          <ProductForm
            shopId={shop.id}
            categories={categories}
            productId={product.id}
            defaultValues={{
              name: product.name,
              slug: product.slug,
              description: product.description ?? "",
              price: product.priceFrom,
              categoryId: product.categoryId ?? "",
              isActive: product.isActive,
            }}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-2">
            Images
          </h2>
          <ImagesEditor
            productId={product.id}
            images={product.images}
            onUpdate={() => router.refresh()}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-2">
            Options
          </h2>
          <p className="text-sm text-gray-400">
            Define options like Size or Color. Variants are generated from all combinations.
          </p>
          <OptionsEditor
            productId={product.id}
            shopId={shop.id}
            optionTypes={product.optionTypes}
            onUpdate={() => router.refresh()}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-2">
            Variants
          </h2>
          <VariantsEditor
            productId={product.id}
            priceFrom={product.priceFrom}
            variants={product.variants}
          />
        </section>
      </div>
    </div>
  );
}
