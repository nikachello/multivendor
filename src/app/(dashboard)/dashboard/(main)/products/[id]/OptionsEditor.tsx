"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProductOptionType } from "@/lib/db/queries";
import {
  addOptionType,
  addOptionValue,
  removeOptionTypeFromProduct,
  removeOptionValue,
} from "@/lib/actions/options";

type Props = {
  productId: string;
  shopId: string;
  optionTypes: ProductOptionType[];
  onUpdate: () => void;
};

export default function OptionsEditor({ productId, shopId, optionTypes, onUpdate }: Props) {
  const [newTypeName, setNewTypeName] = useState("");
  // raw input text per option type
  const [inputs, setInputs] = useState<Record<string, string>>({});
  // values pending save (not yet in DB) per option type
  const [pending, setPending] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Processes the raw input for an option type: splits by comma, adds novel values to pending
  function flushInput(optionTypeId: string, raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) return;

    const savedValues = optionTypes.find((ot) => ot.optionTypeId === optionTypeId)?.values.map((v) => v.value) ?? [];
    const existingPending = pending[optionTypeId] ?? [];
    const novel = parts.filter((p) => !savedValues.includes(p) && !existingPending.includes(p));

    if (novel.length > 0) {
      setPending((prev) => ({
        ...prev,
        [optionTypeId]: [...existingPending, ...novel],
      }));
    }
    setInputs((prev) => ({ ...prev, [optionTypeId]: "" }));
  }

  function handleInputChange(optionTypeId: string, value: string) {
    // If user typed a comma, immediately flush
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
    setPending((prev) => ({
      ...prev,
      [optionTypeId]: (prev[optionTypeId] ?? []).filter((v) => v !== value),
    }));
  }

  async function handleSavePending(optionTypeId: string) {
    const values = pending[optionTypeId] ?? [];
    if (values.length === 0) return;

    setSaving((prev) => ({ ...prev, [optionTypeId]: true }));
    for (const value of values) {
      const result = await addOptionValue(optionTypeId, value);
      if (!result.ok) toast.error(`Failed to add "${value}"`);
    }
    setSaving((prev) => ({ ...prev, [optionTypeId]: false }));
    setPending((prev) => ({ ...prev, [optionTypeId]: [] }));
    onUpdate();
  }

  async function handleAddType() {
    if (!newTypeName.trim()) return;
    const result = await addOptionType(productId, shopId, newTypeName.trim());
    if (!result.ok) { toast.error("Failed to add option"); return; }
    setNewTypeName("");
    onUpdate();
  }

  async function handleRemoveType(optionTypeId: string) {
    const result = await removeOptionTypeFromProduct(productId, optionTypeId);
    if (!result.ok) { toast.error("Failed to remove option"); return; }
    onUpdate();
  }

  async function handleRemoveValue(optionValueId: string) {
    const result = await removeOptionValue(optionValueId);
    if (!result.ok) { toast.error("Failed to remove value"); return; }
    onUpdate();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Existing option types */}
      {optionTypes.map((ot) => {
        const pendingValues = pending[ot.optionTypeId] ?? [];
        const hasPending = pendingValues.length > 0;

        return (
          <div key={ot.optionTypeId} className="border border-gray-200 rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{ot.name}</span>
              <button
                onClick={() => handleRemoveType(ot.optionTypeId)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>

            {/* Saved + pending values as pills */}
            <div className="flex flex-wrap gap-2">
              {ot.values.map((v) => (
                <span
                  key={v.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded text-sm text-gray-700"
                >
                  {v.value}
                  <button
                    onClick={() => handleRemoveValue(v.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
              {/* Pending (unsaved) pills */}
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

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={inputs[ot.optionTypeId] ?? ""}
                onChange={(e) => handleInputChange(ot.optionTypeId, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(ot.optionTypeId, e)}
                placeholder={`Type values, separate by comma (e.g. S, M, L)`}
                className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              {hasPending && (
                <button
                  onClick={() => handleSavePending(ot.optionTypeId)}
                  disabled={saving[ot.optionTypeId]}
                  className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {saving[ot.optionTypeId] ? "Saving..." : "Save"}
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

      {/* Add new option type */}
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
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          Add Option
        </button>
      </div>
    </div>
  );
}
