"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProductOptionType } from "@/lib/db/queries";
import {
  addOptionType,
  addOptionValues,
  removeOptionTypeFromProduct,
  removeOptionValue,
} from "@/lib/actions/options";

type Props = {
  productId: string;
  shopId: string;
  optionTypes: ProductOptionType[];
};

export default function OptionsEditor({ productId, shopId, optionTypes: initial }: Props) {
  const [optionTypes, setOptionTypes] = useState<ProductOptionType[]>(initial);
  const [newTypeName, setNewTypeName] = useState("");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [addingType, setAddingType] = useState(false);
  const [removingTypeId, setRemovingTypeId] = useState<string | null>(null);
  const [deletingValueId, setDeletingValueId] = useState<string | null>(null);

  function flushInput(optionTypeId: string, raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;

    const savedValues = optionTypes.find((ot) => ot.optionTypeId === optionTypeId)?.values.map((v) => v.value) ?? [];
    const existingPending = pending[optionTypeId] ?? [];
    const novel = parts.filter((p) => !savedValues.includes(p) && !existingPending.includes(p));

    if (novel.length > 0) {
      setPending((prev) => ({ ...prev, [optionTypeId]: [...existingPending, ...novel] }));
    }
    setInputs((prev) => ({ ...prev, [optionTypeId]: "" }));
  }

  function handleInputChange(optionTypeId: string, value: string) {
    if (value.endsWith(",")) {
      flushInput(optionTypeId, value);
    } else {
      setInputs((prev) => ({ ...prev, [optionTypeId]: value }));
    }
  }

  function handleInputKeyDown(optionTypeId: string, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      flushInput(optionTypeId, inputs[optionTypeId] ?? "");
    }
  }

  function removePending(optionTypeId: string, value: string) {
    setPending((prev) => ({ ...prev, [optionTypeId]: (prev[optionTypeId] ?? []).filter((v) => v !== value) }));
  }

  async function handleSavePending(optionTypeId: string) {
    const values = pending[optionTypeId] ?? [];
    if (!values.length) return;

    setSaving((prev) => ({ ...prev, [optionTypeId]: true }));
    // One server call, one auth check, all upserts in parallel
    const result = await addOptionValues(optionTypeId, values);
    setSaving((prev) => ({ ...prev, [optionTypeId]: false }));

    if (!result.ok) {
      toast.error("Failed to save values");
      return;
    }

    // Update local state — no router.refresh() needed
    setOptionTypes((prev) =>
      prev.map((ot) =>
        ot.optionTypeId === optionTypeId
          ? { ...ot, values: [...ot.values, ...result.data] }
          : ot,
      ),
    );
    setPending((prev) => ({ ...prev, [optionTypeId]: [] }));
  }

  async function handleAddType() {
    if (!newTypeName.trim() || addingType) return;
    setAddingType(true);
    const result = await addOptionType(productId, shopId, newTypeName.trim());
    setAddingType(false);

    if (!result.ok) {
      toast.error("Failed to add option");
      return;
    }

    setOptionTypes((prev) => [
      ...prev,
      { optionTypeId: result.data.id, name: result.data.name, values: [] },
    ]);
    setNewTypeName("");
  }

  async function handleRemoveType(optionTypeId: string) {
    if (removingTypeId) return;
    setRemovingTypeId(optionTypeId);
    const result = await removeOptionTypeFromProduct(productId, optionTypeId);
    setRemovingTypeId(null);

    if (!result.ok) {
      toast.error("Failed to remove option");
      return;
    }

    setOptionTypes((prev) => prev.filter((ot) => ot.optionTypeId !== optionTypeId));
  }

  async function handleRemoveValue(optionValueId: string, optionTypeId: string) {
    if (deletingValueId) return;
    setDeletingValueId(optionValueId);
    const result = await removeOptionValue(optionValueId);
    setDeletingValueId(null);

    if (!result.ok) {
      toast.error("Failed to remove value");
      return;
    }

    setOptionTypes((prev) =>
      prev.map((ot) =>
        ot.optionTypeId === optionTypeId
          ? { ...ot, values: ot.values.filter((v) => v.id !== optionValueId) }
          : ot,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 rounded px-3 py-2">
        Option types (Size, Color, etc.) are shared across your shop. Adding a value here makes it available to all products using that option.
      </p>

      {optionTypes.map((ot) => {
        const pendingValues = pending[ot.optionTypeId] ?? [];
        const hasPending = pendingValues.length > 0;
        const isRemovingThisType = removingTypeId === ot.optionTypeId;

        return (
          <div key={ot.optionTypeId} className="border border-gray-200 rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{ot.name}</span>
              <button
                onClick={() => handleRemoveType(ot.optionTypeId)}
                disabled={isRemovingThisType}
                className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {isRemovingThisType ? "Removing…" : "Remove"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ot.values.map((v) => {
                const isDeleting = deletingValueId === v.id;
                return (
                  <span
                    key={v.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-sm text-gray-700 transition-opacity ${isDeleting ? "opacity-40" : ""}`}
                  >
                    {v.value}
                    <button
                      onClick={() => handleRemoveValue(v.id, ot.optionTypeId)}
                      disabled={isDeleting || !!deletingValueId}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {pendingValues.map((v) => (
                <span
                  key={v}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 border-dashed rounded text-sm text-blue-700"
                >
                  {v}
                  <button
                    onClick={() => removePending(ot.optionTypeId, v)}
                    className="text-blue-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={inputs[ot.optionTypeId] ?? ""}
                onChange={(e) => handleInputChange(ot.optionTypeId, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(ot.optionTypeId, e)}
                placeholder="Type values, separate by comma (e.g. S, M, L)"
                className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              {hasPending && (
                <button
                  onClick={() => handleSavePending(ot.optionTypeId)}
                  disabled={saving[ot.optionTypeId]}
                  className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {saving[ot.optionTypeId] ? "Saving…" : "Save"}
                </button>
              )}
            </div>
            {hasPending && (
              <p className="text-xs text-blue-500">
                {pendingValues.length} unsaved value(s) — click Save to add them.
              </p>
            )}
          </div>
        );
      })}

      <div className="flex gap-2">
        <input
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddType()}
          placeholder="New option name (e.g. Size, Color)"
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
        />
        <button
          onClick={handleAddType}
          disabled={addingType}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {addingType ? "Adding…" : "Add Option"}
        </button>
      </div>
    </div>
  );
}
