"use client";

import { useState } from "react";
import { updateShipping, ShippingZone } from "@/lib/actions/shop";
import { GEORGIA_CITIES } from "@/lib/constants/georgia-cities";
import { toast } from "sonner";

type Props = {
  shopId: string;
  initialRate: number;
  initialThreshold: number;
  initialZones: ShippingZone[];
  currency: string;
};

export default function ShippingForm({
  shopId,
  initialRate,
  initialThreshold,
  initialZones,
  currency,
}: Props) {
  const [defaultRate, setDefaultRate] = useState(initialRate);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [zones, setZones] = useState<ShippingZone[]>(initialZones);
  const [addingCity, setAddingCity] = useState("");
  const [saving, setSaving] = useState(false);

  const availableCities = GEORGIA_CITIES.filter(
    (c) => !zones.some((z) => z.city_en === c.name_en),
  );

  function addZone() {
    const city = GEORGIA_CITIES.find((c) => c.name_en === addingCity);
    if (!city) return;
    setZones((prev) => [
      ...prev,
      { city_en: city.name_en, city_ka: city.name_ka, rate: defaultRate },
    ]);
    setAddingCity("");
  }

  function updateZoneRate(city_en: string, rate: number) {
    setZones((prev) =>
      prev.map((z) => (z.city_en === city_en ? { ...z, rate } : z)),
    );
  }

  function removeZone(city_en: string) {
    setZones((prev) => prev.filter((z) => z.city_en !== city_en));
  }

  async function handleSave() {
    setSaving(true);
    await updateShipping(shopId, {
      shippingRate: defaultRate,
      freeThreshold: threshold,
      shippingZones: zones,
    });
    setSaving(false);
    toast.success("Shipping settings saved");
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Shipping</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Set default rates and per-city overrides for Georgia.
        </p>
      </div>

      {/* Default rate */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Default rate
        </h2>
        <p className="text-xs text-neutral-400 -mt-1">
          Applied to any city without a specific override.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            step={0.01}
            value={defaultRate}
            onChange={(e) => setDefaultRate(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-32 bg-white"
          />
          <span className="text-sm text-neutral-500">{currency}</span>
          {defaultRate === 0 && (
            <span className="text-xs text-green-600 font-medium">
              Free shipping
            </span>
          )}
        </div>
      </section>

      {/* City overrides */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          City rates
        </h2>
        <p className="text-xs text-neutral-400 -mt-1">
          Override the default for specific cities.
        </p>

        {zones.length > 0 && (
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
            {zones.map((zone) => (
              <div
                key={zone.city_en}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {zone.city_ka}
                  </p>
                  <p className="text-xs text-neutral-400">{zone.city_en}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={zone.rate}
                    onChange={(e) =>
                      updateZoneRate(zone.city_en, Number(e.target.value))
                    }
                    className="border border-gray-200 rounded-md px-2 py-1 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-24 text-right bg-white"
                  />
                  <span className="text-xs text-neutral-400 w-6">
                    {currency}
                  </span>
                </div>
                <button
                  onClick={() => removeZone(zone.city_en)}
                  className="text-neutral-300 hover:text-red-400 transition-colors text-lg leading-none ml-1"
                >
                  Ã—
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <select
            value={addingCity}
            onChange={(e) => setAddingCity(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm flex-1 bg-white"
          >
            <option value="">Select city€¦</option>
            {availableCities.map((c) => (
              <option key={c.name_en} value={c.name_en}>
                {c.name_ka} {c.name_en}
              </option>
            ))}
          </select>
          <button
            onClick={addZone}
            disabled={!addingCity}
            className="px-3 py-1.5 text-[13px] font-medium border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white"
          >
            + Add
          </button>
        </div>
      </section>

      {/* Free threshold */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Free shipping threshold
        </h2>
        <p className="text-xs text-neutral-400 -mt-1">
          Orders above this amount always get free shipping. Set to 0 to
          disable.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-32 bg-white"
          />
          <span className="text-sm text-neutral-500">{currency}</span>
          {threshold > 0 && (
            <span className="text-xs text-neutral-400">
              Free above {currency} {threshold.toFixed(2)}
            </span>
          )}
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1.5 text-[13px] font-medium bg-gray-900 text-white rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
      >
        {saving ? "Saving€¦" : "Save"}
      </button>
    </div>
  );
}
