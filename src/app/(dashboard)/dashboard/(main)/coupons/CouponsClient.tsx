"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Coupon, CouponType } from "@/generated/prisma/client";
import {
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "@/lib/actions/coupons";

type Props = {
  shopId: string;
  currency: string;
  coupons: Coupon[];
};

const EMPTY_FORM = {
  code: "",
  type: "percentage" as CouponType,
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(d));
}

function isExpired(c: Coupon) {
  return c.expiresAt !== null && new Date(c.expiresAt) < new Date();
}

function isExhausted(c: Coupon) {
  return c.maxUses !== null && c.usedCount >= c.maxUses;
}

export default function CouponsClient({
  shopId,
  currency,
  coupons: initial,
}: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function patch(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const val = Number(form.value);
    if (!form.code.trim()) return toast.error("Code is required");
    if (!val || val <= 0) return toast.error("Value must be greater than 0");
    if (form.type === "percentage" && val > 100)
      return toast.error("Percentage cannot exceed 100");

    setCreating(true);
    const result = await createCoupon(shopId, {
      code: form.code,
      type: form.type,
      value: val,
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    });
    setCreating(false);

    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }
    setCoupons((prev) => [result.data as unknown as Coupon, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    toast.success("Coupon created");
  }

  async function handleToggle(c: Coupon) {
    setTogglingId(c.id);
    const result = await updateCoupon(c.id, { isActive: !c.isActive });
    setTogglingId(null);
    if (!result.ok) {
      toast.error("Failed to update");
      return;
    }
    setCoupons((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, isActive: !c.isActive } : x)),
    );
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);
    const result = await deleteCoupon(id);
    setDeletingId(null);
    if (!result.ok) {
      toast.error("Failed to delete");
      return;
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all"
        >
          {showForm ? "Cancel" : "+ New Coupon"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="border border-gray-200 rounded-lg p-5 flex flex-col gap-4 bg-gray-50"
        >
          <p className="text-sm font-medium text-gray-900">New coupon</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Code <span className="text-red-400">*</span>
              </label>
              <input
                value={form.code}
                onChange={(e) => patch("code", e.target.value.toUpperCase())}
                placeholder="SUMMER20"
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-mono outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Type <span className="text-red-400">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => patch("type", e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed amount ({currency})</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Value <span className="text-red-400">*</span>
                <span className="text-gray-400 font-normal ml-1">
                  {form.type === "percentage" ? "%" : currency}
                </span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={form.type === "percentage" ? 100 : undefined}
                value={form.value}
                onChange={(e) => patch("value", e.target.value)}
                placeholder={form.type === "percentage" ? "20" : "10.00"}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Min order{" "}
                <span className="text-gray-400 font-normal">
                  ({currency}, optional)
                </span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.minOrderAmount}
                onChange={(e) => patch("minOrderAmount", e.target.value)}
                placeholder="0.00"
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Max uses{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.maxUses}
                onChange={(e) => patch("maxUses", e.target.value)}
                placeholder="Unlimited"
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">
                Expires{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => patch("expiresAt", e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {creating ? "Creating€¦" : "Create Coupon"}
            </button>
          </div>
        </form>
      )}

      <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Code
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Discount
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Uses
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Expires
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-gray-400"
                >
                  No coupons yet create one above.
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const expired = isExpired(c);
                const exhausted = isExhausted(c);
                const effectivelyActive = c.isActive && !expired && !exhausted;

                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-gray-900">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {c.type === "percentage"
                        ? `${Number(c.value)}% off`
                        : `${currency} ${Number(c.value).toFixed(2)} off`}
                      {c.minOrderAmount !== null && (
                        <span className="text-gray-400 text-xs ml-1">
                          (min {currency} {Number(c.minOrderAmount).toFixed(2)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.usedCount}
                      {c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {c.expiresAt ? (
                        <span className={expired ? "text-red-500" : ""}>
                          {formatDate(c.expiresAt)}
                        </span>
                      ) : (
                        "Never"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {expired || exhausted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-400">
                          {expired ? "Expired" : "Exhausted"}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggle(c)}
                          disabled={togglingId === c.id}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            effectivelyActive
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {togglingId === c.id
                            ? "€¦"
                            : effectivelyActive
                              ? "Active"
                              : "Inactive"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setConfirmDeleteId(c.id)}
                        disabled={deletingId === c.id}
                        className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Delete coupon?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-mono font-medium text-gray-900">
                  {coupons.find((c) => c.id === confirmDeleteId)?.code}
                </span>{" "}
                will be permanently removed and can no longer be used at
                checkout.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
