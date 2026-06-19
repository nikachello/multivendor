"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "@/lib/actions/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    "Pending",
  confirmed:  "Confirmed",
  processing: "Processing",
  shipped:    "Shipped",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
  refunded:   "Refunded",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-gray-100 text-gray-500 border-gray-200",
  refunded:   "bg-red-50 text-red-500 border-red-200",
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: OrderStatus) {
    if (next === status) return;
    setSaving(true);
    const result = await updateOrderStatus(orderId, next);
    setSaving(false);
    if (!result?.ok) { toast.error("Failed to update status"); return; }
    setStatus(next);
    toast.success("Status updated");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${STATUS_STYLES[status]}`}>
        {STATUS_LABELS[status]}
      </span>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className="text-sm border border-gray-200 rounded px-2 py-1 outline-none focus:border-gray-400 transition-colors disabled:opacity-50"
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {saving && <span className="text-xs text-gray-400">Saving…</span>}
    </div>
  );
}
