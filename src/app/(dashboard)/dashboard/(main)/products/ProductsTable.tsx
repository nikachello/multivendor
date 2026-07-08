"use client";

import DataTable from "@/components/ui/data-table";
import { ProductWithRelations } from "@/lib/db/queries";
import { createColumns } from "./columns";
import { useT } from "@/i18n/context";

type Props = {
  products: ProductWithRelations[];
  currency: string;
};

export default function ProductsTable({ products, currency }: Props) {
  const t = useT();

  return (
    <DataTable
      columns={createColumns(currency, t)}
      data={products}
      emptyMessage={t("dashboard.products.no_products")}
    />
  );
}
