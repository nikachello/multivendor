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
import { useT } from "@/i18n/context";
import { ErrorCode } from "@/lib/errors";

type Category = { id: string; name: string };

type Props = {
  shopId: string;
  categories: Category[];
  currency?: string;
  productId?: string;
  defaultValues?: Partial<z.input<typeof productSchema>>;
};

type FormInput = z.input<typeof productSchema>;

export default function ProductForm({
  shopId,
  categories: initialCategories,
  currency = "GEL",
  productId,
  defaultValues,
}: Props) {
  const router = useRouter();
  const isEditing = !!productId;
  const t = useT();

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
    setValue(
      "slug",
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  }, [name, isEditing, setValue]);

  useEffect(() => {
    setNewCatSlug(
      newCatName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  }, [newCatName]);

  async function onSubmit(data: FormInput) {
    const result = isEditing
      ? await updateProduct(
          productId,
          data.name,
          data.slug,
          data.description ?? "",
          Number(data.price),
          data.categoryIds ?? [],
        )
      : await createProduct(
          shopId,
          data.name,
          data.slug,
          data.description ?? "",
          Number(data.price),
          data.categoryIds ?? [],
        );

    if (!result || !result.ok) {
      if (result?.error?.code === ErrorCode.PLAN_LIMIT_REACHED) {
        const limit = result.error.message;
        toast.error(
          <span>
            {t("dashboard.products.limit_reached").replace("{limit}", limit)}{" "}
            <a href="/dashboard/billing" className="underline font-medium">
              {t("dashboard.products.upgrade_prompt")}
            </a>
          </span>,
        );
      } else {
        toast.error(isEditing ? t("dashboard.product_form.update_failed") : t("dashboard.product_form.create_failed"));
      }
      return;
    }
    toast.success(isEditing ? t("dashboard.product_form.updated") : t("dashboard.product_form.created"));
    if (!isEditing) {
      router.push(`/dashboard/products/${result.data.id}`);
    }
  }

  async function handleCreateCategory() {
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    setCatCreating(true);
    const result = await createCategory(
      shopId,
      newCatName.trim(),
      newCatSlug.trim(),
      "",
      true,
    );
    setCatCreating(false);
    if (!result.ok) {
      toast.error(t("dashboard.product_form.category_create_failed"));
      return;
    }
    const created = { id: result.data.id, name: result.data.name };
    setCategories((prev) => [...prev, created]);
    const current = watch("categoryIds") ?? [];
    setValue("categoryIds", [...current, created.id]);
    setShowModal(false);
    setNewCatName("");
    setNewCatSlug("");
    toast.success(t("dashboard.product_form.category_created", { name: created.name }));
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-xl"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.product_form.name")} <span className="text-red-400">*</span>
          </label>
          <input
            {...register("name")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm"
            placeholder={t("dashboard.product_form.name_placeholder")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.product_form.slug")} <span className="text-red-400">*</span>
          </label>
          <input
            {...register("slug")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm font-mono"
            placeholder={t("dashboard.product_form.slug_placeholder")}
          />
          {isEditing && (
            <p className="text-xs text-gray-400">
              {t("dashboard.product_form.slug_hint")}
            </p>
          )}
          {errors.slug && (
            <p className="text-xs text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.product_form.description")}{" "}
            <span className="text-gray-400 font-normal text-xs">
              {t("dashboard.product_form.description_optional")}
            </span>
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm resize-none"
            placeholder={t("dashboard.product_form.description_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.product_form.price")} <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none select-none">
              {currency}
            </span>
            <input
              {...register("price")}
              type="number"
              step="0.01"
              min="0"
              className="border border-gray-200 rounded-lg pl-11 pr-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-full"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {t("dashboard.product_form.categories")}
            </label>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              {t("dashboard.product_form.new_category")}
            </button>
          </div>
          <div className="relative">
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
              {categories.length === 0 && (
                <p className="px-3 py-2 text-sm text-gray-400">
                  {t("dashboard.product_form.no_categories")}
                </p>
              )}
              {categories.map((c) => {
                const selected = (watch("categoryIds") ?? []).includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const current = watch("categoryIds") ?? [];
                        setValue(
                          "categoryIds",
                          e.target.checked
                            ? [...current, c.id]
                            : current.filter((id) => id !== c.id),
                        );
                      }}
                      className="w-4 h-4 accent-gray-900"
                    />
                    <span className="text-sm text-gray-700">{c.name}</span>
                  </label>
                );
              })}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register("isActive")}
            type="checkbox"
            id="isActive"
            className="w-4 h-4"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            {t("dashboard.product_form.active")}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isSubmitting
            ? isEditing
              ? t("dashboard.product_form.saving")
              : t("dashboard.product_form.creating")
            : isEditing
              ? t("dashboard.product_form.save_changes")
              : t("dashboard.product_form.create")}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                {t("dashboard.product_form.new_category_modal")}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewCatName("");
                  setNewCatSlug("");
                }}
                className="text-gray-400 hover:text-gray-700 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">{t("dashboard.product_form.name")}</label>
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm"
                placeholder={t("dashboard.product_form.name_placeholder")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">{t("dashboard.product_form.slug")}</label>
              <input
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm font-mono"
                placeholder={t("dashboard.product_form.slug_placeholder")}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewCatName("");
                  setNewCatSlug("");
                }}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={catCreating || !newCatName.trim()}
                className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {catCreating ? t("dashboard.product_form.creating") : t("dashboard.product_form.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
