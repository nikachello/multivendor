"use client";

import { useRouter, usePathname } from "next/navigation";
import { OrderStatus } from "@/generated/prisma/client";
import { useT } from "@/i18n/context";

const ALL_STATUSES = [
  "pending", "confirmed", "processing", "shipped",
  "delivered", "cancelled", "refunded",
] as OrderStatus[];

export default function StatusFilter({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useT();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(window.location.search);
    if (e.target.value) params.set("status", e.target.value); else params.delete("status");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={value}
      onChange={onChange}
      className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
    >
      <option value="">{t("dashboard.status_filter.all")}</option>
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {t(`dashboard.orders.status_${s}`)}
        </option>
      ))}
    </select>
  );
}
