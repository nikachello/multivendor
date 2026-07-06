import { getShop } from "@/lib/auth/get-shop";
import { getCouponsByShop } from "@/lib/actions/coupons";
import CouponsClient from "./CouponsClient";
import { isProShop } from "@/lib/subscription";
import { getDict } from "@/i18n";

export default async function CouponsPage() {
  const shop = await getShop();
  const isPro = isProShop(shop.subscriptionPaidUntil);

  const [d, couponsResult] = await Promise.all([
    getDict(),
    isPro ? getCouponsByShop(shop.id) : Promise.resolve({ ok: true as const, data: [] }),
  ]);
  const coupons = couponsResult.ok ? couponsResult.data : [];
  const t = d.dashboard.coupons;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{t.subtitle}</p>
      </div>
      <CouponsClient shopId={shop.id} currency={shop.currency ?? "GEL"} coupons={coupons} isPro={isPro} />
    </div>
  );
}
