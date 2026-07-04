"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateCollectionConfig } from "@/lib/actions/shop";
import type { CollectionConfig } from "@/lib/db/queries";

type Props = {
  shopId: string;
  shopSlug: string;
  optionTypeNames: string[];
  initial: Required<CollectionConfig>;
};

export default function CollectionConfigForm({ shopId, shopSlug, optionTypeNames, initial }: Props) {
  const [showSort, setShowSort] = useState(initial.showSort);
  const [showPrice, setShowPrice] = useState(initial.showPrice);
  const [showInStock, setShowInStock] = useState(initial.showInStock);
  // null = show all; we convert to a Set for easy toggling
  const [limitOptions, setLimitOptions] = useState(initial.visibleOptionTypes !== null);
  const [visibleOptions, setVisibleOptions] = useState<Set<string>>(
    new Set(initial.visibleOptionTypes ?? optionTypeNames),
  );
  const [saving, setSaving] = useState(false);

  function toggleOption(name: string) {
    setVisibleOptions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    const config: CollectionConfig = {
      showSort,
      showPrice,
      showInStock,
      visibleOptionTypes: limitOptions ? Array.from(visibleOptions) : null,
    };
    const result = await updateCollectionConfig(shopId, shopSlug, config);
    setSaving(false);
    if (!result?.ok) {
      toast.error("Failed to save");
      return;
    }
    toast.success("Collection filters saved");
  }

  const toggleCls = (on: boolean) =>
    `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? "bg-gray-900" : "bg-gray-200"}`;
  const thumbCls = (on: boolean) =>
    `inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-1"}`;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Collection page filters
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Choose which filters buyers can see on your collection pages.
        </p>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-medium text-gray-700">Sort</p>
          <p className="text-xs text-gray-400">Newest, price low–high, A–Z</p>
        </div>
        <button type="button" onClick={() => setShowSort((v) => !v)} className={toggleCls(showSort)}>
          <span className={thumbCls(showSort)} />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-medium text-gray-700">Price filter</p>
          <p className="text-xs text-gray-400">Min / max price range</p>
        </div>
        <button type="button" onClick={() => setShowPrice((v) => !v)} className={toggleCls(showPrice)}>
          <span className={thumbCls(showPrice)} />
        </button>
      </div>

      {/* In stock */}
      <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
        <div>
          <p className="text-[13px] font-medium text-gray-700">In stock only</p>
          <p className="text-xs text-gray-400">Hide sold-out products</p>
        </div>
        <button type="button" onClick={() => setShowInStock((v) => !v)} className={toggleCls(showInStock)}>
          <span className={thumbCls(showInStock)} />
        </button>
      </div>

      {/* Option types */}
      {optionTypeNames.length > 0 && (
        <div className="flex flex-col gap-3 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-gray-700">Attribute filters</p>
              <p className="text-xs text-gray-400">Size, Color, Material, etc.</p>
            </div>
            <button type="button" onClick={() => setLimitOptions((v) => !v)} className={toggleCls(limitOptions)}>
              <span className={thumbCls(limitOptions)} />
            </button>
          </div>

          {limitOptions && (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
              {optionTypeNames.map((name) => {
                const checked = visibleOptions.has(name);
                return (
                  <label
                    key={name}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(name)}
                      className="w-4 h-4 accent-gray-900"
                    />
                    <span className="text-[13px] text-gray-700">{name}</span>
                  </label>
                );
              })}
            </div>
          )}
          {!limitOptions && (
            <p className="text-xs text-gray-400 italic">
              All attribute filters shown. Toggle to restrict which ones appear.
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 self-start"
      >
        {saving ? "Saving..." : "Save filter settings"}
      </button>
    </section>
  );
}
