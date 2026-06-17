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
  onUpdate: () => void; // tells the parent to re-fetch after changes
};

export default function OptionsEditor({ productId, shopId, optionTypes, onUpdate }: Props) {
  const [newTypeName, setNewTypeName] = useState("");
  const [newValues, setNewValues] = useState<Record<string, string>>({}); // optionTypeId → input value

  async function handleAddType() {
    if (!newTypeName.trim()) return;
    const result = await addOptionType(productId, shopId, newTypeName.trim());
    if (!result.ok) { toast.error("Failed to add option"); return; }
    setNewTypeName("");
    onUpdate();
  }

  async function handleAddValue(optionTypeId: string) {
    const value = newValues[optionTypeId];
    if (!value?.trim()) return;
    const result = await addOptionValue(optionTypeId, value.trim());
    if (!result.ok) { toast.error("Failed to add value"); return; }
    setNewValues((prev) => ({ ...prev, [optionTypeId]: "" }));
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
      {optionTypes.map((ot) => (
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

          {/* Values */}
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
          </div>

          {/* Add value input */}
          <div className="flex gap-2">
            <input
              value={newValues[ot.optionTypeId] ?? ""}
              onChange={(e) => setNewValues((prev) => ({ ...prev, [ot.optionTypeId]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleAddValue(ot.optionTypeId)}
              placeholder={`Add ${ot.name} value...`}
              className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={() => handleAddValue(ot.optionTypeId)}
              className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      ))}

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
