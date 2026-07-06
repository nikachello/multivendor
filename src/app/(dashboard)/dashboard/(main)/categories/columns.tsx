"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryWithCount } from "@/lib/db/queries";

type ColumnLabels = {
  name: string;
  slug: string;
  products: string;
  status: string;
  active: string;
  inactive: string;
  edit: string;
  delete: string;
};

export function createColumns(
  onDelete: (id: string) => void,
  labels: ColumnLabels,
): ColumnDef<CategoryWithCount>[] {
  return [
    {
      accessorKey: "name",
      header: labels.name,
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: labels.slug,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-400">
          {row.original.slug}
        </span>
      ),
    },
    {
      id: "products",
      header: labels.products,
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original._count.products}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: labels.status,
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700">
            {labels.active}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
            {labels.inactive}
          </span>
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/categories/${row.original.id}`}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {labels.edit}
          </Link>
          <button
            onClick={() => onDelete(row.original.id)}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            {labels.delete}
          </button>
        </div>
      ),
    },
  ];
}
