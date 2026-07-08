"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { CollectionFacets, CollectionSortOption, CollectionConfig } from "@/lib/db/queries";
import { useT } from "@/i18n/context";

const SORT_VALUES: CollectionSortOption[] = ["newest", "price_asc", "price_desc", "name_asc"];

type Props = {
  facets: CollectionFacets;
  sort: CollectionSortOption;
  minPrice?: number;
  maxPrice?: number;
  optionFilters: Record<string, string[]>;
  inStockOnly: boolean;
  total: number;
  allTotal: number;
  currency: string;
  currentParamsStr: string;
  config: Required<CollectionConfig>;
};

export default function CollectionFilters({
  facets,
  sort,
  minPrice,
  maxPrice,
  optionFilters,
  inStockOnly,
  total,
  allTotal,
  currency,
  currentParamsStr,
  config,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const t = useT();
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState(minPrice !== undefined ? String(minPrice) : "");
  const [priceMax, setPriceMax] = useState(maxPrice !== undefined ? String(maxPrice) : "");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function buildUrl(updates: Record<string, string | null | undefined>) {
    const params = new URLSearchParams(currentParamsStr);
    params.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(updates: Record<string, string | null | undefined>) {
    setOpenPanel(null);
    startTransition(() => router.push(buildUrl(updates)));
  }

  function toggleOptionValue(typeName: string, value: string) {
    const current = optionFilters[typeName] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    navigate({ [typeName]: next.length ? next.join(",") : null });
  }

  function applyPrice() {
    navigate({ minPrice: priceMin || null, maxPrice: priceMax || null });
  }

  function clearPrice() {
    setPriceMin("");
    setPriceMax("");
    navigate({ minPrice: null, maxPrice: null });
  }

  const activeOptionFilters = Object.entries(optionFilters).filter(([, v]) => v.length > 0);
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;
  const hasAnyFilter =
    sort !== "newest" ||
    inStockOnly ||
    hasPriceFilter ||
    activeOptionFilters.length > 0;

  const filterBtnBase =
    "border rounded-lg px-3 py-1.5 text-xs transition-colors outline-none flex items-center gap-1";
  const filterBtnInactive =
    "border-neutral-200 text-neutral-700 bg-white hover:border-neutral-400";
  const filterBtnActive = "border-neutral-900 bg-neutral-900 text-white";

  return (
    <div className="mb-6 space-y-3" ref={barRef}>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        {config.showSort && (
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => navigate({ sort: e.target.value })}
              className="appearance-none border border-neutral-200 rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-700 bg-white cursor-pointer outline-none hover:border-neutral-400 transition-colors"
            >
              {SORT_VALUES.map((v) => (
                <option key={v} value={v}>
                  {t(`storefront.filters.sort_${v}`)}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-[10px]">
              ▾
            </span>
          </div>
        )}

        {/* Price */}
        {config.showPrice && <div className="relative">
          <button
            onClick={() => setOpenPanel(openPanel === "price" ? null : "price")}
            className={`${filterBtnBase} ${hasPriceFilter ? filterBtnActive : filterBtnInactive}`}
          >
            {t("storefront.filters.price")}
            {hasPriceFilter && (
              <span className="text-[10px] opacity-70">
                {minPrice !== undefined && maxPrice !== undefined
                  ? ` ${minPrice}–${maxPrice}`
                  : minPrice !== undefined
                  ? ` ≥${minPrice}`
                  : ` ≤${maxPrice}`}
              </span>
            )}
            <span className="text-[10px] ml-0.5">▾</span>
          </button>
          {openPanel === "price" && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 p-4 space-y-3">
              <p className="text-xs font-medium text-neutral-700">
                {t("storefront.filters.price_range")} ({currency})
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder={String(Math.floor(facets.priceRange.min))}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-neutral-400 transition-colors"
                />
                <span className="text-neutral-400 text-xs shrink-0">–</span>
                <input
                  type="number"
                  min={0}
                  placeholder={String(Math.ceil(facets.priceRange.max))}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-neutral-400 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {hasPriceFilter && (
                  <button
                    onClick={clearPrice}
                    className="flex-1 border border-neutral-200 text-neutral-600 text-xs py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    {t("storefront.filters.clear")}
                  </button>
                )}
                <button
                  onClick={applyPrice}
                  className="flex-1 bg-neutral-900 text-white text-xs py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {t("storefront.filters.apply")}
                </button>
              </div>
            </div>
          )}
        </div>}

        {/* Dynamic option type filters — only show types allowed by config */}
        {facets.options
          .filter((o) =>
            config.visibleOptionTypes === null || config.visibleOptionTypes.includes(o.name),
          )
          .map((option) => {
            const active = optionFilters[option.name] ?? [];
            const isActive = active.length > 0;
            return (
              <div key={option.name} className="relative">
                <button
                  onClick={() =>
                    setOpenPanel(openPanel === option.name ? null : option.name)
                  }
                  className={`${filterBtnBase} ${isActive ? filterBtnActive : filterBtnInactive}`}
                >
                  {option.name}
                  {isActive && (
                    <span className="text-[10px] opacity-70">({active.length})</span>
                  )}
                  <span className="text-[10px] ml-0.5">▾</span>
                </button>
                {openPanel === option.name && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 py-1.5 max-h-60 overflow-y-auto">
                    {option.values.map((value) => {
                      const checked = active.includes(value);
                      return (
                        <button
                          key={value}
                          onClick={() => toggleOptionValue(option.name, value)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 text-left transition-colors"
                        >
                          <span
                            className={`w-3.5 h-3.5 border rounded shrink-0 flex items-center justify-center ${
                              checked
                                ? "border-neutral-900 bg-neutral-900"
                                : "border-neutral-300"
                            }`}
                          >
                            {checked && (
                              <span className="text-white text-[8px] leading-none">
                                ✓
                              </span>
                            )}
                          </span>
                          {value}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        {/* In stock */}
        {config.showInStock && facets.hasTrackedInventory && (
          <button
            onClick={() => navigate({ inStock: inStockOnly ? null : "true" })}
            className={`${filterBtnBase} ${inStockOnly ? filterBtnActive : filterBtnInactive}`}
          >
            <span
              className={`w-3.5 h-3.5 border rounded-sm shrink-0 flex items-center justify-center ${
                inStockOnly ? "border-white bg-white" : "border-neutral-300"
              }`}
            >
              {inStockOnly && (
                <span className="text-neutral-900 text-[8px] leading-none">✓</span>
              )}
            </span>
            {t("storefront.filters.in_stock")}
          </button>
        )}

        {/* Count + clear */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-neutral-400">
            {total === allTotal
              ? `${total} ${total !== 1 ? t("storefront.filters.product_plural") : t("storefront.filters.product_singular")}`
              : `${total} of ${allTotal}`}
          </span>
          {hasAnyFilter && (
            <button
              onClick={() => startTransition(() => router.push(pathname))}
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2"
            >
              {t("storefront.filters.clear_all")}
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {(activeOptionFilters.length > 0 || hasPriceFilter || inStockOnly) && (
        <div className="flex flex-wrap gap-1.5">
          {hasPriceFilter && (
            <button
              onClick={clearPrice}
              className="flex items-center gap-1 border border-neutral-200 rounded-full px-2.5 py-1 text-[11px] text-neutral-600 hover:border-neutral-400 bg-neutral-50 transition-colors"
            >
              Price: {minPrice ?? 0}–{maxPrice ?? "∞"} {currency}
              <span className="text-neutral-400 ml-0.5">×</span>
            </button>
          )}
          {inStockOnly && (
            <button
              onClick={() => navigate({ inStock: null })}
              className="flex items-center gap-1 border border-neutral-200 rounded-full px-2.5 py-1 text-[11px] text-neutral-600 hover:border-neutral-400 bg-neutral-50 transition-colors"
            >
              {t("storefront.filters.in_stock")} <span className="text-neutral-400 ml-0.5">×</span>
            </button>
          )}
          {activeOptionFilters.map(([typeName, values]) =>
            values.map((value) => (
              <button
                key={`${typeName}-${value}`}
                onClick={() => toggleOptionValue(typeName, value)}
                className="flex items-center gap-1 border border-neutral-200 rounded-full px-2.5 py-1 text-[11px] text-neutral-600 hover:border-neutral-400 bg-neutral-50 transition-colors"
              >
                {value} <span className="text-neutral-400 ml-0.5">×</span>
              </button>
            )),
          )}
        </div>
      )}
    </div>
  );
}
