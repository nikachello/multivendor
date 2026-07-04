"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { startSubscriptionPayment } from "@/lib/actions/billing";

export default function BillingClient({ isActive }: { isActive: boolean }) {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") toast.success("Payment successful! Subscription activated.");
    if (status === "failed") toast.error("Payment failed. Please try again.");
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
        {loading ? "Redirecting to BOG..." : isActive ? "Renew — 29 GEL" : "Activate — 29 GEL"}
      </button>
      <p className="text-[11px] text-gray-400">
        You will be redirected to Bank of Georgia to complete the payment securely.
      </p>
    </div>
  );
}
