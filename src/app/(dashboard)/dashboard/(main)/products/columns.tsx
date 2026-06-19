"use client";

import { ProductWithRelations } from "@/lib/db/queries";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export function createColumns(currency: string): ColumnDef<ProductWithRelations>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "priceFrom",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.priceFrom} {currency}</span>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">{row.original.category?.name ?? <span className="text-gray-300">—</span>}</span>
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
        <Link
          href={`/dashboard/products/${row.original.id}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Edit →
        </Link>
      ),
    },
  ];
}
