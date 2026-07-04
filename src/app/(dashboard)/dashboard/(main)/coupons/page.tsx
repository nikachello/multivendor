import { getShop } from "@/lib/auth/get-shop";
import { getCouponsByShop } from "@/lib/actions/coupons";
import CouponsClient from "./CouponsClient";

export default async function CouponsPage() {
  const shop = await getShop();
  const result = await getCouponsByShop(shop.id);
  const coupons = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Coupons</h1>
        <p className="text-sm text-gray-400 mt-0.5">Create discount codes for your customers</p>
      </div>
      <CouponsClient shopId={shop.id} currency={shop.currency ?? "GEL"} coupons={coupons} />
    </div>
  );
}
