"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { categorySchema } from "@/lib/validators/category";
import { createCategory, updateCategory } from "@/lib/actions/categories";

type Props = {
  shopId: string;
  categoryId?: string;
  defaultValues?: Partial<z.input<typeof categorySchema>>;
};

type FormInput = z.input<typeof categorySchema>;

export default function CategoryForm({ shopId, categoryId, defaultValues }: Props) {
  const router = useRouter();
  const isEditing = !!categoryId;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { isActive: true, ...defaultValues },
  });

  const name = watch("name");

  useEffect(() => {
    if (!name || isEditing) return;
    setValue("slug", name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }, [name, isEditing, setValue]);

  async function onSubmit(data: FormInput) {
    const result = isEditing
      ? await updateCategory(categoryId, data.name, data.slug, data.description ?? "", data.isActive ?? true)
      : await createCategory(shopId, data.name, data.slug, data.description ?? "", data.isActive ?? true);

    if (!result || !result.ok) {
      toast.error(isEditing ? "Failed to update category" : "Failed to create category");
      return;
    }
    toast.success(isEditing ? "Category updated" : "Category created");
    router.push("/dashboard/categories");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          {...register("name")}
          className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
          placeholder="Category name"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Slug</label>
        <input
          {...register("slug")}
          className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors font-mono"
          placeholder="category-slug"
        />
        {isEditing && <p className="text-xs text-gray-400">Changing the slug will break any existing links to this category.</p>}
        {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors resize-none"
          placeholder="Optional description"
        />
      </div>

      <div className="flex items-center gap-2">
        <input {...register("isActive")} type="checkbox" id="isActive" className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible in store)</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50 self-start"
      >
        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}
