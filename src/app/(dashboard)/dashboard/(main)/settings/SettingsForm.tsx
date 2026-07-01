"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateShop } from "@/lib/actions/shop";
import ImageUploader from "@/components/ui/ImageUploader";

const CURRENCIES = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "GEL", label: "GEL — Georgian Lari" },
  { code: "TRY", label: "TRY — Turkish Lira" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "JPY", label: "JPY — Japanese Yen" },
  { code: "AED", label: "AED — UAE Dirham" },
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
  };
};

export default function SettingsForm({ shopId, shopSlug, defaultValues }: Props) {
  const router = useRouter();
  const [name, setName] = useState(defaultValues.name);
  const [description, setDescription] = useState(defaultValues.description);
  const [currency, setCurrency] = useState(defaultValues.currency);
  const [logo, setLogo] = useState(defaultValues.logo);
  const [metaPixelId, setMetaPixelId] = useState(defaultValues.metaPixelId);
  const [ga4MeasurementId, setGa4MeasurementId] = useState(defaultValues.ga4MeasurementId);
  const [googleAdsId, setGoogleAdsId] = useState(defaultValues.googleAdsId);
  const [googleAdsConversionLabel, setGoogleAdsConversionLabel] = useState(defaultValues.googleAdsConversionLabel);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    const result = await updateShop(shopId, { name, description, currency, logo, metaPixelId, ga4MeasurementId, googleAdsId, googleAdsConversionLabel });
    setSaving(false);
    if (!result || !result.ok) { toast.error("Failed to save settings"); return; }
    toast.success("Settings saved");
    router.refresh();
  }

  const inputCls = "border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl">
      {/* General */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">General</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Store name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="My Store" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Store URL slug</label>
          <input value={shopSlug} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
          <p className="text-xs text-gray-400">URL slug cannot be changed after creation.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Tell customers about your store"
          />
        </div>
      </section>

      {/* Currency */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">Commerce</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`${inputCls} bg-white`}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Logo */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">Branding</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Logo</label>
          {logo ? (
            <div className="relative w-32 h-16 group">
              <img src={logo} alt="Logo" className="w-32 h-16 object-contain rounded border border-gray-200 bg-gray-50 p-1" />
              <button
                type="button"
                onClick={() => setLogo("")}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ) : (
            <ImageUploader endpoint="categoryImage" maxFiles={1} onUploadComplete={(urls) => setLogo(urls[0])} />
          )}
        </div>
      </section>

      {/* Tracking */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">Tracking & Analytics</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Meta Pixel ID</label>
          <input
            value={metaPixelId}
            onChange={(e) => setMetaPixelId(e.target.value)}
            className={inputCls}
            placeholder="123456789012345"
          />
          <p className="text-xs text-gray-400">Found in Meta Events Manager → Data Sources → your Pixel → Settings.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Google Analytics 4 Measurement ID</label>
          <input
            value={ga4MeasurementId}
            onChange={(e) => setGa4MeasurementId(e.target.value)}
            className={inputCls}
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-gray-400">Found in GA4 → Admin → Data Streams → your stream → Measurement ID.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Google Ads ID</label>
          <input
            value={googleAdsId}
            onChange={(e) => setGoogleAdsId(e.target.value)}
            className={inputCls}
            placeholder="AW-123456789"
          />
          <p className="text-xs text-gray-400">Found in Google Ads → Tools → Tag setup → your tag ID.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Google Ads Conversion Label</label>
          <input
            value={googleAdsConversionLabel}
            onChange={(e) => setGoogleAdsConversionLabel(e.target.value)}
            className={inputCls}
            placeholder="AbCdEfGhIjKlMnOp"
          />
          <p className="text-xs text-gray-400">Found in Google Ads → Goals → Conversions → your purchase conversion → Tag setup.</p>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-50 self-start"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
