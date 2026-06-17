"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { productSchema } from "@/lib/validators/product";
import { createProduct, updateProduct } from "@/lib/actions/products";

type Props = {
  shopId: string;
  categories: { id: string; name: string }[];
  productId?: string;
  defaultValues?: Partial<z.input<typeof productSchema>>;
};

type FormInput = z.input<typeof productSchema>;

export default function ProductForm({ shopId, categories, productId, defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!productId;

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
    setValue(
      "slug",
      name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    );
  }, [name]);

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

  return (
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
          readOnly={isEditing}
          className={`border border-gray-200 rounded px-3 py-2 text-sm outline-none transition-colors font-mono ${
            isEditing ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "focus:border-gray-400"
          }`}
          placeholder="product-slug"
        />
        {isEditing && <p className="text-xs text-gray-400">Slug cannot be changed after creation.</p>}
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
        <label className="text-sm font-medium text-gray-700">Category</label>
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
        <input
          {...register("isActive")}
          type="checkbox"
          id="isActive"
          className="w-4 h-4"
        />
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
  );
}
