"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/lib/db/queries";
import { generateVariants, updateVariants, deleteVariant } from "@/lib/actions/variants";
import { useT } from "@/i18n/context";

type Variant = ProductWithRelations["variants"][number];

type EditState = {
  price: string;
  stock: string;
  sku: string;
  trackInventory: boolean;
};

type Props = {
  productId: string;
  priceFrom: number;
  variants: Variant[];
};

function getVariantLabel(variant: Variant): string {
  return variant.optionValues.map((ov) => ov.optionValue.value).join(" / ");
}

function initialEdit(v: Variant): EditState {
  return {
    price: String(v.price),
    stock: String(v.stock),
    sku: v.sku,
    trackInventory: v.trackInventory ?? true,
  };
}

function isDirty(v: Variant, edit: EditState): boolean {
  const origTrack = v.trackInventory ?? true;
  return (
    edit.price !== String(v.price) ||
    edit.stock !== String(v.stock) ||
    edit.sku !== v.sku ||
    edit.trackInventory !== origTrack
  );
}

export default function VariantsEditor({ productId, priceFrom, variants: initialVariants }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const t = useT();
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  useEffect(() => { setVariants(initialVariants); }, [initialVariants]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSku, setShowSku] = useState(false);
  const [edits, setEdits] = useState<Record<string, EditState>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Bulk action inputs
  const [bulkPriceSet, setBulkPriceSet] = useState("");
  const [bulkStockSet, setBulkStockSet] = useState("");

  function getEdit(v: Variant): EditState {
    return edits[v.id] ?? initialEdit(v);
  }

  function patchEdit(v: Variant, patch: Partial<EditState>) {
    setEdits((prev) => ({ ...prev, [v.id]: { ...getEdit(v), ...patch } }));
  }

  function patchAll(patch: (edit: EditState) => Partial<EditState>) {
    setEdits((prev) => {
      const next = { ...prev };
      for (const v of variants) {
        next[v.id] = { ...getEdit(v), ...patch(getEdit(v)) };
      }
      return next;
    });
  }

  const dirtyVariants = useMemo(
    () => variants.filter((v) => isDirty(v, getEdit(v))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variants, edits],
  );

  async function handleGenerate() {
    // Flush pending edits first (parallel), then generate
    if (dirtyVariants.length > 0) {
      setSaving(true);
      const result = await updateVariants(
        dirtyVariants.map((v) => {
          const edit = getEdit(v);
          return { id: v.id, price: Number(edit.price), stock: Number(edit.stock), sku: edit.sku, trackInventory: edit.trackInventory };
        }),
      );
      setSaving(false);
      if (!result.ok) {
        toast.error(t("dashboard.variants_editor.gen_abort"));
        return;
      }
      setEdits({});
    }

    setGenerating(true);
    const result = await generateVariants(productId, priceFrom);
    setGenerating(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    if (result.data.created === 0) {
      toast.info(t("dashboard.variants_editor.all_exist"));
    } else {
      toast.success(t("dashboard.variants_editor.created", { n: result.data.created }));
      // New variants were created on the server — refresh to load them
      startTransition(() => router.refresh());
    }
  }

  async function handleSaveAll() {
    if (dirtyVariants.length === 0) return;
    setSaving(true);
    const result = await updateVariants(
      dirtyVariants.map((v) => {
        const edit = getEdit(v);
        return { id: v.id, price: Number(edit.price), stock: Number(edit.stock), sku: edit.sku, trackInventory: edit.trackInventory };
      }),
    );
    setSaving(false);
    if (!result.ok) {
      toast.error(t("dashboard.variants_editor.save_failed"));
    } else {
      toast.success(
        dirtyVariants.length === 1 ? t("dashboard.variants_editor.saved_one") : t("dashboard.variants_editor.saved_many", { n: dirtyVariants.length }),
      );
      setEdits({});
    }
  }

  async function handleDelete(variantId: string) {
    setConfirmDeleteId(null);
    const result = await deleteVariant(variantId);
    if (!result.ok) { toast.error(t("dashboard.variants_editor.delete_failed")); return; }
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
    toast.success(t("dashboard.variants_editor.removed"));
  }

  // ── Bulk helpers ─────────────────────────────────────────────
  function bulkUnlimitedAll() {
    patchAll(() => ({ trackInventory: false }));
  }

  function bulkTrackAll() {
    patchAll(() => ({ trackInventory: true }));
  }

  function bulkSetStock() {
    const val = bulkStockSet.trim();
    if (!val || isNaN(Number(val))) return;
    patchAll(() => ({ stock: val, trackInventory: true }));
    setBulkStockSet("");
  }

  function bulkAdjustPrice(factor: number) {
    patchAll((edit) => ({
      price: (Math.round(Number(edit.price) * factor * 100) / 100).toFixed(2),
    }));
  }

  function bulkSetPrice() {
    const val = bulkPriceSet.trim();
    if (!val || isNaN(Number(val))) return;
    patchAll(() => ({ price: Number(val).toFixed(2) }));
    setBulkPriceSet("");
  }

  if (variants.length === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{t("dashboard.variants_editor.no_variants")}</p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {generating ? t("dashboard.variants_editor.generating") : t("dashboard.variants_editor.generate")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">{t("dashboard.variants_editor.variant_count", { n: variants.length })}</p>
          <button
            type="button"
            onClick={() => setShowSku((s) => !s)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
          >
            {showSku ? t("dashboard.variants_editor.hide_sku") : t("dashboard.variants_editor.show_sku")}
          </button>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {generating ? t("dashboard.variants_editor.generating") : t("dashboard.variants_editor.generate")}
        </button>
      </div>

      {/* Bulk actions */}
      <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t("dashboard.variants_editor.bulk_actions")}</p>

        {/* Stock row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 w-10">{t("dashboard.variants_editor.stock")}</span>
          <button
            type="button"
            onClick={bulkUnlimitedAll}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
          >
            {t("dashboard.variants_editor.unlimited_all")}
          </button>
          <button
            type="button"
            onClick={bulkTrackAll}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
          >
            {t("dashboard.variants_editor.track_all")}
          </button>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={bulkStockSet}
              onChange={(e) => setBulkStockSet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && bulkSetStock()}
              placeholder={t("dashboard.variants_editor.qty_placeholder")}
              className="w-16 border border-gray-200 rounded-md px-2 py-1 text-xs outline-none focus:border-gray-400 shadow-sm"
            />
            <button
              type="button"
              onClick={bulkSetStock}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
            >
              {t("dashboard.variants_editor.set_all")}
            </button>
          </div>
        </div>

        {/* Price row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 w-10">{t("dashboard.variants_editor.price_placeholder")}</span>
          {([-10, -5, 5, 10] as const).map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => bulkAdjustPrice(1 + pct / 100)}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
            >
              {pct > 0 ? `+${pct}%` : `${pct}%`}
            </button>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              step="0.01"
              value={bulkPriceSet}
              onChange={(e) => setBulkPriceSet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && bulkSetPrice()}
              placeholder={t("dashboard.variants_editor.price_placeholder")}
              className="w-20 border border-gray-200 rounded-md px-2 py-1 text-xs outline-none focus:border-gray-400 shadow-sm"
            />
            <button
              type="button"
              onClick={bulkSetPrice}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
            >
              {t("dashboard.variants_editor.set_all")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t("dashboard.variants_editor.variant_col")}</th>
              {showSku && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t("dashboard.variants_editor.sku_col")}</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t("dashboard.variants_editor.price_col")}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{t("dashboard.variants_editor.stock_col")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const edit = getEdit(v);
              const dirty = isDirty(v, edit);
              return (
                <tr
                  key={v.id}
                  className={`border-t border-gray-100 ${dirty ? "border-l-2 border-l-blue-400 bg-blue-50/30" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {getVariantLabel(v) || "—"}
                  </td>
                  {showSku && (
                    <td className="px-4 py-3">
                      <input
                        value={edit.sku}
                        onChange={(e) => patchEdit(v, { sku: e.target.value })}
                        className="w-28 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={edit.price}
                      onChange={(e) => patchEdit(v, { price: e.target.value })}
                      className="w-24 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {edit.trackInventory ? (
                        <input
                          type="number"
                          min="0"
                          value={edit.stock}
                          onChange={(e) => patchEdit(v, { stock: e.target.value })}
                          className="w-20 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                        />
                      ) : (
                        <span className="w-20 px-2 py-1 text-sm text-gray-400">∞</span>
                      )}
                      <button
                        type="button"
                        title={edit.trackInventory ? t("dashboard.variants_editor.switch_unlimited") : t("dashboard.variants_editor.switch_tracked")}
                        onClick={() => patchEdit(v, { trackInventory: !edit.trackInventory })}
                        className="text-gray-300 hover:text-gray-600 transition-colors"
                      >
                        {edit.trackInventory ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7A5 5 0 017 7h2M15 17h2a5 5 0 000-10h-2M9 12h6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setConfirmDeleteId(v.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title={t("dashboard.variants_editor.delete_title")}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom save bar */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 z-10 bg-white border-t border-gray-100 -mx-4 px-4 -mb-4 pb-4">
        {dirtyVariants.length > 0 && (
          <p className="text-xs text-blue-500">
            {dirtyVariants.length === 1 ? t("dashboard.variants_editor.unsaved_one") : t("dashboard.variants_editor.unsaved_many", { n: dirtyVariants.length })}
          </p>
        )}
        <button
          onClick={handleSaveAll}
          disabled={saving || dirtyVariants.length === 0}
          className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? t("dashboard.variants_editor.saving")
            : dirtyVariants.length === 0
              ? t("dashboard.variants_editor.no_changes")
              : dirtyVariants.length === 1
                ? t("dashboard.variants_editor.save_one")
                : t("dashboard.variants_editor.save_many", { n: dirtyVariants.length })}
        </button>
      </div>

      {/* Delete variant confirmation */}
      {confirmDeleteId && (() => {
        const v = variants.find((v) => v.id === confirmDeleteId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{t("dashboard.variants_editor.delete_confirm")}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">{getVariantLabel(v!) || "—"}</span> {t("dashboard.variants_editor.delete_body")}
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
