"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/lib/db/queries";
import { generateVariants, updateVariant, deleteVariant } from "@/lib/actions/variants";

type Variant = ProductWithRelations["variants"][number];

type Props = {
  productId: string;
  priceFrom: number;
  variants: Variant[];
};

function getVariantLabel(variant: Variant): string {
  return variant.optionValues
    .map((ov) => ov.optionValue.value)
    .join(" / ");
}

export default function VariantsEditor({ productId, priceFrom, variants }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  // local edits: variantId → { price, stock, sku }
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string; sku: string }>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  async function handleGenerate() {
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

  function getEdit(v: Variant) {
    return edits[v.id] ?? { price: String(v.price), stock: String(v.stock), sku: v.sku };
  }

  function setEdit(variantId: string, field: "price" | "stock" | "sku", value: string) {
    setEdits((prev) => ({
      ...prev,
      [variantId]: { ...getEdit({ id: variantId } as Variant), [field]: value },
    }));
  }

  async function handleSave(v: Variant) {
    const edit = getEdit(v);
    setSaving((prev) => ({ ...prev, [v.id]: true }));
    const result = await updateVariant(v.id, Number(edit.price), Number(edit.stock), edit.sku);
    setSaving((prev) => ({ ...prev, [v.id]: false }));
    if (!result.ok) { toast.error("Failed to save"); return; }
    toast.success("Saved");
    router.refresh();
  }

  async function handleDelete(variantId: string) {
    await deleteVariant(variantId);
    toast.success("Variant removed");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {variants.length === 0
            ? "No variants yet. Add options above then generate."
            : `${variants.length} variant(s)`}
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Variants"}
        </button>
      </div>

      {variants.length > 0 && (
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Variant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => {
                const edit = getEdit(v);
                return (
                  <tr key={v.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {getVariantLabel(v) || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        value={edit.sku}
                        onChange={(e) => setEdit(v.id, "sku", e.target.value)}
                        className="w-28 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={edit.price}
                        onChange={(e) => setEdit(v.id, "price", e.target.value)}
                        className="w-24 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={edit.stock}
                        onChange={(e) => setEdit(v.id, "stock", e.target.value)}
                        className="w-20 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-gray-400"
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleSave(v)}
                        disabled={saving[v.id]}
                        className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        {saving[v.id] ? "..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="px-3 py-1 text-red-400 hover:text-red-600 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
