import { getShop } from "@/lib/auth/get-shop";
import SettingsForm from "./SettingsForm";
import CustomDomainForm from "./CustomDomainForm";

export default async function SettingsPage() {
  const shop = await getShop();

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your store details and preferences.</p>
      </div>

      <SettingsForm
        shopId={shop.id}
        shopSlug={shop.slug}
        defaultValues={{
          name: shop.name,
          description: shop.description ?? "",
          currency: shop.currency,
          logo: shop.logo ?? "",
          metaPixelId: shop.metaPixelId ?? "",
          ga4MeasurementId: shop.ga4MeasurementId ?? "",
          googleAdsId: shop.googleAdsId ?? "",
          googleAdsConversionLabel: shop.googleAdsConversionLabel ?? "",
        }}
      />

      <CustomDomainForm
        shopId={shop.id}
        initialDomain={shop.customDomain ?? null}
        initialVerified={shop.domainVerified}
      />
    </div>
  );
}
