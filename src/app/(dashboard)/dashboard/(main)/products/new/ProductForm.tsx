"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { productSchema } from "@/lib/validators/product";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { createCategory } from "@/lib/actions/categories";

type Category = { id: string; name: string };

type Props = {
  shopId: string;
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<z.input<typeof productSchema>>;
};

type FormInput = z.input<typeof productSchema>;

export default function ProductForm({ shopId, categories: initialCategories, productId, defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!productId;

  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [catCreating, setCatCreating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true, ...defaultValues },
  });

  const name = watch("name");

  useEffect(() => {
    if (!name || isEditing) return;
    setValue("slug", name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }, [name, isEditing, setValue]);

  useEffect(() => {
    setNewCatSlug(newCatName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }, [newCatName]);

  async function onSubmit(data: FormInput) {
    const result = isEditing
      ? await updateProduct(productId, data.name, data.slug, data.description ?? "", Number(data.price), data.categoryId ?? "")
      : await createProduct(shopId, data.name, data.slug, data.description ?? "", Number(data.price), data.categoryId ?? "");

    if (!result || !result.ok) {
      toast.error(isEditing ? "Failed to update product" : "Failed to create product");
      return;
    }
    toast.success(isEditing ? "Product updated" : "Product created");
    router.push("/dashboard/products");
  }

  async function handleCreateCategory() {
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    setCatCreating(true);
    const result = await createCategory(shopId, newCatName.trim(), newCatSlug.trim(), "", true);
    setCatCreating(false);
    if (!result.ok) { toast.error("Failed to create category"); return; }
    const created = { id: result.data.id, name: result.data.name };
    setCategories((prev) => [...prev, created]);
    setValue("categoryId", created.id);
    setShowModal(false);
    setNewCatName("");
    setNewCatSlug("");
    toast.success(`Category "${created.name}" created`);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name")}
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
            placeholder="Product name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Slug</label>
          <input
            {...register("slug")}
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors font-mono"
            placeholder="product-slug"
          />
          {isEditing && <p className="text-xs text-gray-400">Changing the slug will break existing links to this product.</p>}
          {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
            placeholder="Product description"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            {...register("price")}
            type="number"
            step="0.01"
            min="0"
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
            placeholder="0.00"
          />
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              + New category
            </button>
          </div>
          <select
            {...register("categoryId")}
            className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input {...register("isActive")} type="checkbox" id="isActive" className="w-4 h-4" />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            Active (visible in store)
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Product")}
        </button>
      </form>

      {/* ── Inline category creation modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">New category</h2>
              <button
                onClick={() => { setShowModal(false); setNewCatName(""); setNewCatSlug(""); }}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
                placeholder="Category name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">Slug</label>
              <input
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors font-mono"
                placeholder="category-slug"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowModal(false); setNewCatName(""); setNewCatSlug(""); }}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={catCreating || !newCatName.trim()}
                className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {catCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
