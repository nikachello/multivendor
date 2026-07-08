"use client";

import { useState } from "react";
import { toast } from "sonner";
import { setShopActive, adminExtendSubscription } from "@/lib/actions/admin";

type Props = {
  shopId: string;
  isActive: boolean;
  isPro: boolean;
  subscriptionPaidUntil: string | null;
};

export default function AdminShopActions({ shopId, isActive, isPro, subscriptionPaidUntil }: Props) {
  const [active, setActive] = useState(isActive);
  const [toggling, setToggling] = useState(false);
  const [days, setDays] = useState("30");
  const [extending, setExtending] = useState(false);
  const [paidUntil, setPaidUntil] = useState(subscriptionPaidUntil);

  async function handleToggleActive() {
    setToggling(true);
    const result = await setShopActive(shopId, !active);
    setToggling(false);
    if (!result.ok) { toast.error("Failed to update shop status"); return; }
    setActive(!active);
    toast.success(active ? "Shop disabled" : "Shop enabled");
  }

  async function handleExtend() {
    const d = parseInt(days, 10);
    if (!Number.isInteger(d) || d < 1 || d > 365) { toast.error("Enter 1–365 days"); return; }
    setExtending(true);
    const result = await adminExtendSubscription(shopId, d);
    setExtending(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    setPaidUntil(result.data.paidUntil.toISOString());
    toast.success(`Subscription extended by ${d} days`);
  }

  return (
    <div className="space-y-4">
      {/* Toggle active */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Shop Status</h3>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${active ? "text-green-700" : "text-red-600"}`}>
            {active ? "Active" : "Disabled"}
          </span>
          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
          >
            {toggling ? "Updating…" : active ? "Disable Shop" : "Enable Shop"}
          </button>
        </div>
      </div>

      {/* Extend subscription */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Subscription</h3>
        <div className="text-xs text-zinc-500">
          <span className={`font-medium ${isPro ? "text-violet-700" : "text-zinc-600"}`}>{isPro ? "Pro" : "Free"}</span>
          {paidUntil && (
            <span className="ml-2">· expires {new Date(paidUntil).toLocaleDateString()}</span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min={1}
            max={365}
            className="w-20 border border-zinc-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-zinc-400"
          />
          <span className="text-sm text-zinc-400 self-center">days</span>
          <button
            onClick={handleExtend}
            disabled={extending}
            className="ml-auto px-3 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {extending ? "Extending…" : "Extend Pro"}
          </button>
        </div>
      </div>
    </div>
  );
}
