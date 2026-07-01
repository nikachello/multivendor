"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Shop } from "@/generated/prisma/client";
import { ProductOptionType } from "@/lib/db/queries";
import { ProductWithRelations } from "@/lib/db/queries";
import ProductForm from "../new/ProductForm";
import OptionsEditor from "./OptionsEditor";
import VariantsEditor from "./VariantsEditor";
import ImagesEditor from "./ImagesEditor";

type Tab = "details" | "images" | "options" | "variants";

const TABS: { id: Tab; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "images", label: "Images" },
  { id: "options", label: "Options" },
  { id: "variants", label: "Variants" },
];

type Props = {
  product: ProductWithRelations & { optionTypes: ProductOptionType[] };
  shop: Shop;
  categories: Category[];
};

export default function ProductEditTabs({ product, shop, categories }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === "details" && (
        <ProductForm
          shopId={shop.id}
          categories={categories}
          productId={product.id}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            price: product.priceFrom,
            categoryIds: product.categories.map((c) => c.id),
            isActive: product.isActive,
          }}
        />
      )}

      {activeTab === "images" && (
        <ImagesEditor
          productId={product.id}
          images={product.images}
          onUpdate={() => router.refresh()}
        />
      )}

      {activeTab === "options" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">
            Define options like Size or Color. Variants are generated from all combinations.
          </p>
          <OptionsEditor
            productId={product.id}
            shopId={shop.id}
            optionTypes={product.optionTypes}
          />
        </div>
      )}

      {activeTab === "variants" && (
        <VariantsEditor
          productId={product.id}
          priceFrom={product.priceFrom}
          variants={product.variants}
        />
      )}
    </div>
  );
}
