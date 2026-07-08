"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateShop } from "@/lib/actions/shop";
import ImageUploader from "@/components/ui/ImageUploader";
import { useT } from "@/i18n/context";

const CURRENCIES = [
  { code: "USD", label: "USD  US Dollar" },
  { code: "EUR", label: "EUR  Euro" },
  { code: "GBP", label: "GBP  British Pound" },
  { code: "GEL", label: "GEL  Georgian Lari" },
  { code: "TRY", label: "TRY  Turkish Lira" },
  { code: "CAD", label: "CAD  Canadian Dollar" },
  { code: "AUD", label: "AUD  Australian Dollar" },
  { code: "JPY", label: "JPY  Japanese Yen" },
  { code: "AED", label: "AED  UAE Dirham" },
];

type PaymentMethodField = {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type PaymentMethodDef = {
  id: string;
  label: string;
  description: string;
  fields: PaymentMethodField[];
};

const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Customers pay upon delivery. No credentials required.",
    fields: [],
  },
  {
    id: "bog",
    label: "Bank of Georgia",
    description: "Accept online card payments via your BOG merchant account.",
    fields: [
      { key: "clientId", label: "Client ID", placeholder: "bog_client_id" },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "••••••••••••••••" },
    ],
  },
];

type Props = {
  shopId: string;
  shopSlug: string;
  defaultValues: {
    name: string;
    description: string;
    currency: string;
    logo: string;
    metaPixelId: string;
    ga4MeasurementId: string;
    googleAdsId: string;
    googleAdsConversionLabel: string;
    paymentConfig: Record<string, Record<string, unknown>>;
  };
};

export default function SettingsForm({
  shopId,
  shopSlug,
  defaultValues,
}: Props) {
  const [name, setName] = useState(defaultValues.name);
  const [description, setDescription] = useState(defaultValues.description);
  const [currency, setCurrency] = useState(defaultValues.currency);
  const [logo, setLogo] = useState(defaultValues.logo);
  const [metaPixelId, setMetaPixelId] = useState(defaultValues.metaPixelId);
  const [ga4MeasurementId, setGa4MeasurementId] = useState(
    defaultValues.ga4MeasurementId,
  );
  const [googleAdsId, setGoogleAdsId] = useState(defaultValues.googleAdsId);
  const [googleAdsConversionLabel, setGoogleAdsConversionLabel] = useState(
    defaultValues.googleAdsConversionLabel,
  );
  const [paymentConfig, setPaymentConfig] = useState<Record<string, Record<string, unknown>>>(() => {
    const base: Record<string, Record<string, unknown>> = {};
    for (const m of PAYMENT_METHODS) {
      const existing = defaultValues.paymentConfig?.[m.id] ?? {};
      base[m.id] = {
        enabled: existing.enabled ?? false,
        ...Object.fromEntries(m.fields.map((f) => [f.key, existing[f.key] ?? ""])),
      };
    }
    return base;
  });
  const [saving, setSaving] = useState(false);
  const t = useT();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t("dashboard.settings_form.name_required"));
      return;
    }
    setSaving(true);
    const result = await updateShop(shopId, {
      name,
      description,
      currency,
      logo,
      metaPixelId,
      ga4MeasurementId,
      googleAdsId,
      googleAdsConversionLabel,
      paymentConfig,
    });
    setSaving(false);
    if (!result || !result.ok) {
      toast.error(t("dashboard.settings_form.save_failed"));
      return;
    }
    toast.success(t("dashboard.settings_form.saved"));
  }

  function toggleMethod(id: string) {
    setPaymentConfig((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id]?.enabled },
    }));
  }

  function updatePaymentField(methodId: string, fieldKey: string, value: string) {
    setPaymentConfig((prev) => ({
      ...prev,
      [methodId]: { ...prev[methodId], [fieldKey]: value },
    }));
  }

  const inputCls =
    "border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl">
      {/* General */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          {t("dashboard.settings_form.general")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.store_name")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder={t("dashboard.settings_form.store_name_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.store_slug")}
          </label>
          <input
            value={shopSlug}
            disabled
            className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
          />
          <p className="text-xs text-gray-400">
            {t("dashboard.settings_form.store_slug_hint")}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder={t("dashboard.settings_form.description_placeholder")}
          />
        </div>
      </section>

      {/* Currency */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          {t("dashboard.settings_form.commerce")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{t("dashboard.settings_form.currency")}</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`${inputCls} bg-white`}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Logo */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          {t("dashboard.settings_form.branding")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{t("dashboard.settings_form.logo")}</label>
          {logo ? (
            <div className="relative w-32 h-16 group">
              <img
                src={logo}
                alt="Logo"
                className="w-32 h-16 object-contain rounded border border-gray-200 bg-gray-50 p-1"
              />
              <button
                type="button"
                onClick={() => setLogo("")}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Ã—
              </button>
            </div>
          ) : (
            <ImageUploader
              endpoint="shopLogo"
              maxFiles={1}
              onUploadComplete={(urls) => setLogo(urls[0])}
            />
          )}
        </div>
      </section>

      {/* Tracking */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          {t("dashboard.settings_form.tracking")}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.meta_pixel")}
          </label>
          <input
            value={metaPixelId}
            onChange={(e) => setMetaPixelId(e.target.value)}
            className={inputCls}
            placeholder="123456789012345"
          />
          <p className="text-xs text-gray-400">
            Found in Meta Events Manager Data Sources your Pixel Settings.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.ga4")}
          </label>
          <input
            value={ga4MeasurementId}
            onChange={(e) => setGa4MeasurementId(e.target.value)}
            className={inputCls}
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.google_ads")}
          </label>
          <input
            value={googleAdsId}
            onChange={(e) => setGoogleAdsId(e.target.value)}
            className={inputCls}
            placeholder="AW-123456789"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            {t("dashboard.settings_form.google_ads_label")}
          </label>
          <input
            value={googleAdsConversionLabel}
            onChange={(e) => setGoogleAdsConversionLabel(e.target.value)}
            className={inputCls}
            placeholder="AbCdEfGhIjKlMnOp"
          />
        </div>
      </section>

      {/* Payment Methods */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Payment Methods
        </h2>
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => {
            const config = paymentConfig[method.id] ?? {};
            const enabled = !!config.enabled;
            return (
              <div key={method.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{method.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    role="switch"
                    aria-checked={enabled}
                    className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
                      enabled ? "bg-gray-900" : "bg-gray-200"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      enabled ? "translate-x-4" : "translate-x-0"
                    }`} />
                  </button>
                </div>
                {enabled && method.fields.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex flex-col gap-3">
                    {method.fields.map((field) => (
                      <div key={field.key} className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-600">{field.label}</label>
                        <input
                          type={field.type ?? "text"}
                          value={String(config[field.key] ?? "")}
                          onChange={(e) => updatePaymentField(method.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className={inputCls}
                          autoComplete="off"
                        />
                      </div>
                    ))}
                    {method.id === "bog" && (
                      <p className="text-xs text-gray-400">
                        Find your credentials in the BOG merchant portal. Client Secret is stored securely — leave it blank to keep the existing value.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 self-start"
      >
        {saving ? t("dashboard.settings_form.saving") : t("dashboard.settings_form.save")}
      </button>
    </form>
  );
}
