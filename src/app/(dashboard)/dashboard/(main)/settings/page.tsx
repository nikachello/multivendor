import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import { isProShop } from "@/lib/subscription";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.settings.title };
}
import SettingsForm from "./SettingsForm";
import CustomDomainForm from "./CustomDomainForm";

export default async function SettingsPage() {
  const shop = await getShop();
  const isPro = isProShop(shop.subscriptionPaidUntil);
  const d = await getDict();
  const t = d.dashboard.settings;

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{t.subtitle}</p>
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
          paymentConfig: (() => {
            const raw = (shop.paymentConfig as Record<string, Record<string, unknown>>) ?? {};
            return Object.fromEntries(
              Object.entries(raw).map(([methodId, methodConfig]) => [
                methodId,
                Object.fromEntries(
                  Object.entries(methodConfig).map(([k, v]) =>
                    k.toLowerCase().includes("secret") ? [k, ""] : [k, v]
                  )
                ),
              ])
            );
          })(),
        }}
      />

      <CustomDomainForm
        shopId={shop.id}
        initialDomain={shop.customDomain ?? null}
        initialVerified={shop.domainVerified}
        isPro={isPro}
      />
    </div>
  );
}
