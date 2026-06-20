import { getShop } from "@/lib/auth/get-shop";
import ShippingForm from "./ShippingForm";
import { ShippingZone } from "@/lib/actions/shop";

export default async function ShippingPage() {
  const shop = await getShop();

  return (
    <div className="px-8 py-8">
      <ShippingForm
        shopId={shop.id}
        initialRate={Number(shop.shippingRate)}
        initialThreshold={Number(shop.freeThreshold)}
        initialZones={(shop.shippingZones as ShippingZone[]) ?? []}
        currency={shop.currency}
      />
    </div>
  );
}
