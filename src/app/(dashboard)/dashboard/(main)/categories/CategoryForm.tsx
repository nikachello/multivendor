"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { categorySchema } from "@/lib/validators/category";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import ImageUploader from "@/components/ui/ImageUploader";

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
      ? await updateCategory(categoryId, data.name, data.slug, data.description ?? "", data.isActive ?? true, data.image)
      : await createCategory(shopId, data.name, data.slug, data.description ?? "", data.isActive ?? true, data.image);

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
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm"
          placeholder="Category name"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Slug</label>
        <input
          {...register("slug")}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm font-mono"
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
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm resize-none"
          placeholder="Optional description"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Image</label>
        {watch("image") && (
          <div className="relative w-32 h-32 group">
            <img
              src={watch("image")}
              alt=""
              className="w-32 h-32 object-cover rounded border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setValue("image", "")}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Ã—
            </button>
          </div>
        )}
        {!watch("image") && (
          <ImageUploader
            endpoint="categoryImage"
            maxFiles={1}
            onUploadComplete={(urls) => setValue("image", urls[0])}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input {...register("isActive")} type="checkbox" id="isActive" className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible in store)</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 self-start"
      >
        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}
