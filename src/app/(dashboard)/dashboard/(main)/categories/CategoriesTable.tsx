"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CategoryWithCount } from "@/lib/db/queries";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { deleteCategory } from "@/lib/actions/categories";

export default function CategoriesTable({ categories: initial }: { categories: CategoryWithCount[] }) {
  const [categories, setCategories] = useState(initial);
  const [query, setQuery] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pendingCategory = categories.find((c) => c.id === pendingDeleteId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [categories, query]);

  async function handleDelete() {
    if (!pendingDeleteId) return;
    const idToDelete = pendingDeleteId;
    setDeleting(true);
    const result = await deleteCategory(idToDelete);
    setDeleting(false);
    if (!result.ok) { toast.error("Failed to delete category"); return; }
    setCategories((prev) => prev.filter((c) => c.id !== idToDelete));
    setPendingDeleteId(null);
    toast.success("Category deleted");
  }

  const emptyMessage = query.trim()
    ? `No categories matching "${query}"`
    : "No categories yet — click + New category to get started.";

  return (
    <>
      {categories.length > 0 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories…"
          className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors max-w-xs"
        />
      )}
      <DataTable columns={createColumns(setPendingDeleteId)} data={filtered} emptyMessage={emptyMessage} />

      {/* Confirmation dialog */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Delete category?</h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">{pendingCategory?.name}</span>
                {pendingCategory && pendingCategory._count.products > 0 && (
                  <span className="text-red-500">
                    {" "}— {pendingCategory._count.products} product{pendingCategory._count.products !== 1 ? "s" : ""} will be uncategorized.
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
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
