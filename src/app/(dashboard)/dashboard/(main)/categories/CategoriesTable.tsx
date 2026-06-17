"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category } from "@/generated/prisma/client";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { deleteCategory } from "@/lib/actions/categories";

export default function CategoriesTable({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    const result = await deleteCategory(id);
    if (!result.ok) { toast.error("Failed to delete category"); return; }
    toast.success("Category deleted");
    router.refresh();
  }

  return <DataTable columns={createColumns(handleDelete)} data={categories} />;
}
