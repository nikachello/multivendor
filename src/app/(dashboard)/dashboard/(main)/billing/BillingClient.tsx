"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { startSubscriptionPayment } from "@/lib/actions/billing";
import { useT } from "@/i18n/context";

export default function BillingClient({ isActive }: { isActive: boolean }) {
  const searchParams = useSearchParams();
  const t = useT();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") toast.success(t("dashboard.billing.payment_success"));
    if (status === "failed") toast.error(t("dashboard.billing.payment_failed"));
  }, [searchParams]);

  async function handlePay() {
    setLoading(true);
    const result = await startSubscriptionPayment();
    if (!result.ok) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }
    window.location.href = result.data.redirectUrl;
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-4 py-2.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 self-start"
      >
        {loading ? t("dashboard.billing.redirecting") : isActive ? t("dashboard.billing.renew") : t("dashboard.billing.activate")}
      </button>
      <p className="text-[11px] text-gray-400">
        {t("dashboard.billing.bog_note")}
      </p>
    </div>
  );
}
