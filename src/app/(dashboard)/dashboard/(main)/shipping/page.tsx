import { getShop } from "@/lib/auth/get-shop";
import ShippingForm from "./ShippingForm";
import { ShippingZone } from "@/lib/actions/shop";
import { isProShop } from "@/lib/subscription";

export default async function ShippingPage() {
  const shop = await getShop();
  const isPro = isProShop(shop.subscriptionPaidUntil);

  return (
    <div className="px-8 py-8">
      <ShippingForm
        shopId={shop.id}
        initialRate={Number(shop.shippingRate)}
        initialThreshold={Number(shop.freeThreshold)}
        initialZones={(shop.shippingZones as ShippingZone[]) ?? []}
        currency={shop.currency}
        isPro={isPro}
      />
    </div>
  );
}
