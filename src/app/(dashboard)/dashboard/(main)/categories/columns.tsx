"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/generated/prisma/client";

export function createColumns(onDelete: (id: string) => void): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-400">{row.original.slug}</span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
            Inactive
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
            Edit →
          </Link>
          <button
            onClick={() => onDelete(row.original.id)}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}
