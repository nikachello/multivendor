"use client";

import { useState, useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { ProductWithRelations } from "@/lib/db/queries";
import { createColumns } from "./columns";

type Props = {
  products: ProductWithRelations[];
  currency: string;
};

export default function ProductsTable({ products, currency }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [products, query]);

  const emptyMessage = query.trim()
    ? `No products matching "${query}"`
    : "No products yet — click + New product to get started.";

  return (
    <div className="flex flex-col gap-3">
      {products.length > 0 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors max-w-xs"
        />
      )}
      <DataTable columns={createColumns(currency)} data={filtered} emptyMessage={emptyMessage} />
    </div>
  );
}
