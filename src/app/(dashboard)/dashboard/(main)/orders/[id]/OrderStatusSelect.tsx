"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "@/lib/actions/order";
import { useT } from "@/i18n/context";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:  "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-gray-100 text-gray-500 border-gray-200",
  refunded:   "bg-red-50 text-red-500 border-red-200",
};

const DESTRUCTIVE_STATUSES: OrderStatus[] = ["cancelled", "refunded"];

export default function OrderStatusSelect({ orderId, currentStatus, shopId }: { orderId: string; currentStatus: OrderStatus; shopId: string }) {
  const t = useT();
  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending:    t("dashboard.orders.status_pending"),
    confirmed:  t("dashboard.orders.status_confirmed"),
    processing: t("dashboard.orders.status_processing"),
    shipped:    t("dashboard.orders.status_shipped"),
    delivered:  t("dashboard.orders.status_delivered"),
    cancelled:  t("dashboard.orders.status_cancelled"),
    refunded:   t("dashboard.orders.status_refunded"),
  };
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  async function applyChange(next: OrderStatus) {
    setSaving(true);
    const result = await updateOrderStatus(orderId, next, shopId);
    setSaving(false);
    if (!result?.ok) { toast.error(t("dashboard.order_status.save_failed")); return; }
    setStatus(next);
    toast.success(t("dashboard.order_status.saved"));
  }

  function handleChange(next: OrderStatus) {
    if (next === status) return;
    if (DESTRUCTIVE_STATUSES.includes(next)) {
      setPendingStatus(next);
    } else {
      applyChange(next);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        <select
          value={status}
          disabled={saving}
          onChange={(e) => handleChange(e.target.value as OrderStatus)}
          className="text-[13px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-gray-400 transition-all shadow-sm disabled:opacity-50 bg-white"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {saving && <span className="text-xs text-gray-400">{t("dashboard.order_status.saving")}</span>}
      </div>

      {pendingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {t("dashboard.order_status.confirm_title", { status: STATUS_LABELS[pendingStatus] })}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t("dashboard.order_status.confirm_body", { status: STATUS_LABELS[pendingStatus].toLowerCase() })}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPendingStatus(null)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => { const s = pendingStatus; setPendingStatus(null); applyChange(s); }}
                className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all"
              >
                {t("dashboard.order_status.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
