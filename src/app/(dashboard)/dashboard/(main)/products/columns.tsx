"use client";
import { ProductWithRelations } from "@/lib/db/queries";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export function createColumns(currency: string): ColumnDef<ProductWithRelations>[] {
  return [
    {
      accessorKey: "name",
      header: "სახელი",
    },
    {
      accessorKey: "priceFrom",
      header: "ფასი",
      cell: ({ row }) => `${row.original.priceFrom} ${currency}`,
    },
    {
      accessorKey: "isActive",
      header: "აქტიური",
      cell: ({ row }) => (row.original.isActive ? "✓" : "—"),
    },
    {
      id: "actions",
      header: "ქმედებები",
      cell: ({ row }) => (
        <Link href={`/dashboard/products/${row.original.id}`}>რედაქტირება</Link>
      ),
    },
  ];
}
