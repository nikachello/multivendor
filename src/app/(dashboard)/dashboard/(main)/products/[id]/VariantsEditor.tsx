"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/lib/db/queries";
import { generateVariants, updateVariant, deleteVariant } from "@/lib/actions/variants";

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
    // @ts-expect-error — trackInventory added after migration
    trackInventory: v.trackInventory ?? true,
  };
}

function isDirty(v: Variant, edit: EditState): boolean {
  // @ts-expect-error — trackInventory added after migration
  const origTrack = v.trackInventory ?? true;
  return (
    edit.price !== String(v.price) ||
    edit.stock !== String(v.stock) ||
    edit.sku !== v.sku ||
    edit.trackInventory !== origTrack
  );
}

export default function VariantsEditor({ productId, priceFrom, variants }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSku, setShowSku] = useState(false);
  const [edits, setEdits] = useState<Record<string, EditState>>({});

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
    // Flush any pending edits first so nothing is out of sync after the refresh
    if (dirtyVariants.length > 0) {
      setSaving(true);
      let failed = 0;
      for (const v of dirtyVariants) {
        const edit = getEdit(v);
        const result = await updateVariant(
          v.id,
          Number(edit.price),
          Number(edit.stock),
          edit.sku,
          edit.trackInventory,
        );
        if (!result.ok) failed++;
      }
      setSaving(false);
      if (failed > 0) {
        toast.error(`${failed} variant(s) failed to save — generation aborted`);
        return;
      }
      setEdits({});
      toast.success("Changes saved");
    }

    setGenerating(true);
    const result = await generateVariants(productId, priceFrom);
    setGenerating(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    if (result.data.created === 0) {
      toast.info("All variants already exist");
    } else {
      toast.success(`${result.data.created} variant(s) created`);
    }
    router.refresh();
  }

  async function handleSaveAll() {
    if (dirtyVariants.length === 0) return;
    setSaving(true);
    let failed = 0;
    for (const v of dirtyVariants) {
      const edit = getEdit(v);
      const result = await updateVariant(
        v.id,
        Number(edit.price),
        Number(edit.stock),
        edit.sku,
        edit.trackInventory,
      );
      if (!result.ok) failed++;
    }
    setSaving(false);
    if (failed > 0) {
      toast.error(`${failed} variant(s) failed to save`);
    } else {
      toast.success(
        dirtyVariants.length === 1
          ? "1 change saved"
          : `${dirtyVariants.length} changes saved`,
      );
      setEdits({});
    }
    router.refresh();
  }

  async function handleDelete(variantId: string) {
    await deleteVariant(variantId);
    toast.success("Variant removed");
    router.refresh();
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
        <p className="text-sm text-gray-400">No variants yet. Add options above then generate.</p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Variants"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400">{variants.length} variant(s)</p>
          <button
            type="button"
            onClick={() => setShowSku((s) => !s)}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
          >
            {showSku ? "Hide SKU" : "Show SKU"}
          </button>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Variants"}
        </button>
      </div>

      {/* Bulk actions */}
      <div className="border border-gray-200 rounded p-3 bg-gray-50 flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bulk actions</p>

        {/* Stock row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 w-10">Stock</span>
          <button
            type="button"
            onClick={bulkUnlimitedAll}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
          >
            ∞ Unlimited all
          </button>
          <button
            type="button"
            onClick={bulkTrackAll}
            className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
          >
            # Track all
          </button>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={bulkStockSet}
              onChange={(e) => setBulkStockSet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && bulkSetStock()}
              placeholder="Qty"
              className="w-16 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-gray-400"
            />
            <button
              type="button"
              onClick={bulkSetStock}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
            >
              Set all
            </button>
          </div>
        </div>

        {/* Price row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 w-10">Price</span>
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
              placeholder="Price"
              className="w-20 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-gray-400"
            />
            <button
              type="button"
              onClick={bulkSetPrice}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded hover:border-gray-500 hover:text-gray-900 transition-colors text-gray-600"
            >
              Set all
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Variant</th>
              {showSku && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
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
                        title={edit.trackInventory ? "Switch to unlimited" : "Switch to tracked"}
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
                      onClick={() => handleDelete(v.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Delete variant"
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
      <div className="flex items-center justify-end gap-3">
        {dirtyVariants.length > 0 && (
          <p className="text-xs text-blue-500">
            {dirtyVariants.length} unsaved change{dirtyVariants.length !== 1 ? "s" : ""}
          </p>
        )}
        <button
          onClick={handleSaveAll}
          disabled={saving || dirtyVariants.length === 0}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? "Saving..."
            : dirtyVariants.length === 0
              ? "No changes"
              : `Save ${dirtyVariants.length} change${dirtyVariants.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
