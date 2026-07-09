"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category, Shop } from "@/generated/prisma/client";
import { ProductOptionType } from "@/lib/db/queries";
import { ProductWithRelations } from "@/lib/db/queries";
import ProductForm from "../new/ProductForm";
import OptionsEditor from "./OptionsEditor";
import VariantsEditor from "./VariantsEditor";
import ImagesEditor from "./ImagesEditor";
import { useT } from "@/i18n/context";
import { deleteProduct } from "@/lib/actions/products";

type Tab = "details" | "images" | "options" | "variants";

type Props = {
  product: ProductWithRelations & { optionTypes: ProductOptionType[] };
  shop: Shop;
  categories: Category[];
};

export default function ProductEditTabs({ product, shop, categories }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const t = useT();

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);
    if (!result.ok) { toast.error("Failed to delete product"); return; }
    toast.success("Product deleted");
    router.push("/dashboard/products");
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "details", label: t("dashboard.product_tabs.details") },
    { id: "images", label: t("dashboard.product_tabs.images") },
    { id: "options", label: t("dashboard.product_tabs.options") },
    { id: "variants", label: t("dashboard.product_tabs.variants") },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-gray-100">
        <div className="flex">
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
        <button
          onClick={() => setConfirmDelete(true)}
          className="mb-1 px-3 py-1.5 text-[13px] text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Delete product
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Delete product?</h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">{product.name}</span> will be permanently removed along with all its images, variants, and options.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab panels */}
      {activeTab === "details" && (
        <ProductForm
          shopId={shop.id}
          categories={categories}
          currency={shop.currency}
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
          onUpdate={() => startTransition(() => router.refresh())}
        />
      )}

      {activeTab === "options" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">
            {t("dashboard.product_tabs.variants_hint")}
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
