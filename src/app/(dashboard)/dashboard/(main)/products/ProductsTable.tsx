"use client";

import DataTable from "@/components/ui/data-table";
import { ProductWithRelations } from "@/lib/db/queries";
import { createColumns } from "./columns";

type Props = {
  products: ProductWithRelations[];
  currency: string;
};

export default function ProductsTable({ products, currency }: Props) {
  return <DataTable columns={createColumns(currency)} data={products} />;
}
