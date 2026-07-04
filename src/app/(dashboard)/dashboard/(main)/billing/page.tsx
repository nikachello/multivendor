import { getShop } from "@/lib/auth/get-shop";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const shop = await getShop();

  const paidUntil = shop.subscriptionPaidUntil;
  const isActive = paidUntil ? new Date(paidUntil) > new Date() : false;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your platform subscription.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-6">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Subscription</p>
            <p className="text-xs text-gray-400 mt-0.5">29 GEL / month</p>
          </div>
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[12px] font-medium text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Pro
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[12px] font-medium text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
              Free
            </span>
          )}
        </div>

        {/* Expiry */}
        {paidUntil && (
          <div className="text-xs text-gray-400">
            {isActive ? "Renews" : "Expired"} on{" "}
            <span className="font-medium text-gray-700">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(paidUntil))}
            </span>
          </div>
        )}

        <div className="border-t border-gray-100" />

        <BillingClient isActive={isActive} />
      </div>
    </div>
  );
}
