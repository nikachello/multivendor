"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateCollectionConfig } from "@/lib/actions/shop";
import type { CollectionConfig } from "@/lib/db/queries";

type Props = {
  shopId: string;
  shopSlug: string;
  optionTypeNames: string[];
  initial: Required<CollectionConfig>;
  onSaved: () => void;
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${on ? "bg-neutral-900" : "bg-neutral-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

function Row({ label, hint, on, onToggle }: { label: string; hint: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-xs font-medium text-neutral-800">{label}</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">{hint}</p>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

export default function CollectionPageSettings({ shopId, shopSlug, optionTypeNames, initial, onSaved }: Props) {
  const [showSort, setShowSort] = useState(initial.showSort);
  const [showPrice, setShowPrice] = useState(initial.showPrice);
  const [showInStock, setShowInStock] = useState(initial.showInStock);
  const [limitOptions, setLimitOptions] = useState(initial.visibleOptionTypes !== null);
  const [visibleOptions, setVisibleOptions] = useState<Set<string>>(
    new Set(initial.visibleOptionTypes ?? optionTypeNames),
  );
  const [saving, setSaving] = useState(false);

  const isFirst = useRef(true);
  const onSavedRef = useRef(onSaved);
  useEffect(() => {
    onSavedRef.current = onSaved;
  });

  const configKey = JSON.stringify({
    showSort,
    showPrice,
    showInStock,
    visibleOptionTypes: limitOptions ? Array.from(visibleOptions).sort() : null,
  });

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }

    const config: CollectionConfig = JSON.parse(configKey);
    const timer = setTimeout(async () => {
      setSaving(true);
      const result = await updateCollectionConfig(shopId, shopSlug, config);
      setSaving(false);
      if (!result?.ok) { toast.error("Failed to save"); return; }
      onSavedRef.current();
    }, 800);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  function toggleOption(name: string) {
    setVisibleOptions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-0 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400">
          Filter bar
        </p>
        {saving && (
          <p className="text-[10px] text-neutral-400">Saving…</p>
        )}
      </div>

      <Row label="Sort" hint="Newest, price, A–Z" on={showSort} onToggle={() => setShowSort(v => !v)} />
      <Row label="Price" hint="Min / max range" on={showPrice} onToggle={() => setShowPrice(v => !v)} />
      <Row label="In stock" hint="Hide sold-out products" on={showInStock} onToggle={() => setShowInStock(v => !v)} />

      {optionTypeNames.length > 0 && (
        <div className="py-3 border-b border-neutral-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-800">Attributes</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Size, Color, etc.</p>
            </div>
            <Toggle on={limitOptions} onToggle={() => setLimitOptions(v => !v)} />
          </div>
          {limitOptions && (
            <div className="flex flex-col gap-1">
              {optionTypeNames.map((name) => (
                <label key={name} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-neutral-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleOptions.has(name)}
                    onChange={() => toggleOption(name)}
                    className="w-3.5 h-3.5 accent-neutral-900"
                  />
                  <span className="text-xs text-neutral-700">{name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
