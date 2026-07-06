"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CategoryWithCount } from "@/lib/db/queries";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { deleteCategory } from "@/lib/actions/categories";
import { useT } from "@/i18n/context";

export default function CategoriesTable({
  categories: initial,
}: {
  categories: CategoryWithCount[];
}) {
  const [categories, setCategories] = useState(initial);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pendingCategory = categories.find((c) => c.id === pendingDeleteId);
  const t = useT();

  async function handleDelete() {
    if (!pendingDeleteId) return;
    const idToDelete = pendingDeleteId;
    setDeleting(true);
    const result = await deleteCategory(idToDelete);
    setDeleting(false);
    if (!result.ok) {
      toast.error(t("dashboard.categories.delete_failed"));
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== idToDelete));
    setPendingDeleteId(null);
    toast.success(t("dashboard.categories.deleted"));
  }

  return (
    <>
      <DataTable
        columns={createColumns(setPendingDeleteId, {
          name: t("dashboard.categories.col_name"),
          slug: t("dashboard.categories.col_slug"),
          products: t("dashboard.categories.col_products"),
          status: t("dashboard.categories.col_status"),
          active: t("dashboard.categories.col_active"),
          inactive: t("dashboard.categories.col_inactive"),
          edit: t("dashboard.categories.col_edit"),
          delete: t("common.delete"),
        })}
        data={categories}
        emptyMessage={t("dashboard.categories.no_categories")}
      />

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {t("dashboard.categories.delete_confirm")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">
                  {pendingCategory?.name}
                </span>
                {pendingCategory && pendingCategory._count.products > 0 && (
                  <span className="text-red-500">
                    {" "}
                    {pendingCategory._count.products}{t("dashboard.categories.delete_warning")}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPendingDeleteId(null)}
                disabled={deleting}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all disabled:opacity-60"
              >
                {deleting ? t("dashboard.categories.deleting") : t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
