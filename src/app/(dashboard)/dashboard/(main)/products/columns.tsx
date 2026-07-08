"use client";

import { ProductWithRelations } from "@/lib/db/queries";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export function createColumns(
  currency: string,
  t: (key: string, vars?: Record<string, string | number>) => string,
): ColumnDef<ProductWithRelations>[] {
  return [
    {
      accessorKey: "name",
      header: () => t("dashboard.products.col_name"),
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "priceFrom",
      header: () => t("dashboard.products.col_price"),
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {Number(row.original.priceFrom).toFixed(2)} {currency}
        </span>
      ),
    },
    {
      id: "category",
      header: () => t("dashboard.products.col_category"),
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.categories.length ? (
            row.original.categories.map((c) => c.name).join(", ")
          ) : (
            <span className="text-gray-300"></span>
          )}
        </span>
      ),
    },
    {
      id: "stock",
      header: () => t("dashboard.products.col_stock"),
      cell: ({ row }) => {
        const variants = row.original.variants;
        const tracked = variants.filter((v) => v.trackInventory);
        if (tracked.length === 0)
          return <span className="text-xs text-gray-400">{t("dashboard.products.unlimited")}</span>;
        const total = tracked.reduce((s, v) => s + v.stock, 0);
        if (total === 0)
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600">
              {t("dashboard.products.out_of_stock")}
            </span>
          );
        if (total <= 5)
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700">
              {t("dashboard.products.stock_left", { n: total })}
            </span>
          );
        return <span className="text-xs text-gray-600">{total}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: () => t("dashboard.products.col_status"),
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700">
            {t("dashboard.products.active")}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
            {t("dashboard.products.inactive")}
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
          {t("common.edit")}
        </Link>
      ),
    },
  ];
}
