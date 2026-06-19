"use client";

import { ShopSection } from "@/lib/types/store-section";
import { FieldDef, FlatFieldDef, sectionFieldSchema, sectionLabels } from "@/lib/editor-schema";

type ShopCategory = { id: string; name: string };

type Props = {
  section: ShopSection;
  shopId: string;
  categories: ShopCategory[];
  onChange: (key: string, value: unknown) => void;
};

// Renders a single flat (non-list) field and calls onChange with the new value.
// Extracted so it can be reused both at the top level and inside list items.
function FlatField({
  field,
  value,
  onChange,
}: {
  field: FlatFieldDef;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const labelCls = "block text-xs font-medium text-neutral-600 mb-1.5";
  const inputCls = "w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors";

  if (field.type === "text") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <textarea
          value={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>
    );
  }

  if (field.type === "color") {
    const str = typeof value === "string" ? value : "#000000";
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={str}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 border border-neutral-200 cursor-pointer rounded-sm p-0.5 bg-white"
          />
          <span className="text-xs font-mono text-neutral-500">{str}</span>
        </div>
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <select
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = Number(raw);
            onChange(isNaN(parsed) ? raw : parsed);
          }}
          className={`${inputCls} bg-white`}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return null;
}

// Renders a single FieldDef — delegates flat types to FlatField,
// handles list and select-shop-categories here.
function Field({
  field,
  value,
  categories,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  categories: ShopCategory[];
  onChange: (val: unknown) => void;
}) {
  // Flat types
  if (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "color" ||
    field.type === "select"
  ) {
    return <FlatField field={field} value={value} onChange={onChange} />;
  }

  // Dynamic select whose options come from the shop's category list
  if (field.type === "select-shop-categories") {
    return (
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">
          {field.label}
        </label>
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors bg-white"
        >
          <option value="">— Select a category —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Multi-select checkboxes for categoryIds
  if (field.type === "multiselect-shop-categories") {
    const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">{field.label}</label>
        {categories.length === 0 ? (
          <p className="text-xs text-neutral-400">No categories yet.</p>
        ) : (
          <div className="border border-neutral-200 divide-y divide-neutral-100 max-h-48 overflow-y-auto">
            {categories.map((cat) => {
              const checked = selected.includes(cat.id);
              return (
                <label key={cat.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      onChange(
                        e.target.checked
                          ? [...selected, cat.id]
                          : selected.filter((id) => id !== cat.id),
                      )
                    }
                    className="w-3.5 h-3.5 accent-neutral-900"
                  />
                  <span className="text-xs text-neutral-700">{cat.name}</span>
                </label>
              );
            })}
          </div>
        )}
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="mt-1.5 text-[10px] text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Clear selection (show all)
          </button>
        )}
      </div>
    );
  }

  // List of items, each editable via their own FlatField set
  if (field.type === "list") {
    const items = (value as Record<string, unknown>[]) ?? [];
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-neutral-600">{field.label}s</label>
          <button
            onClick={() => onChange([...items, { ...field.itemDefault, _id: crypto.randomUUID() }])}
            className="text-xs border border-neutral-200 hover:border-neutral-400 px-2 py-0.5 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            + Add
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-neutral-400 text-center py-3 border border-dashed border-neutral-200">
            No items yet
          </p>
        )}

        <div className="space-y-2">
          {items.map((item, idx) => (
            <details key={(item._id as string) ?? idx} className="border border-neutral-200 group">
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none list-none hover:bg-neutral-50">
                <span className="text-xs font-medium text-neutral-600">
                  {field.label} {idx + 1}
                </span>
                <svg
                  className="w-3 h-3 text-neutral-400 transition-transform group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </summary>

              <div className="px-3 pb-3 pt-2 space-y-3 border-t border-neutral-100">
                {field.itemFields.map((f) => (
                  <FlatField
                    key={f.key}
                    field={f}
                    value={item[f.key]}
                    onChange={(val) =>
                      onChange(
                        items.map((it, i) => (i === idx ? { ...it, [f.key]: val } : it))
                      )
                    }
                  />
                ))}
                <button
                  onClick={() => onChange(items.filter((_, i) => i !== idx))}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function SectionSettingsPanel({ section, shopId, categories, onChange }: Props) {
  const fields = sectionFieldSchema[section.type];
  const props = section.props as Record<string, unknown>;

  if (!fields) {
    return (
      <div className="p-5 text-sm text-neutral-400">
        <p className="font-medium text-neutral-600 mb-1">{sectionLabels[section.type]}</p>
        <p>
          {section.type === "navbar" ? (
            <>
              Edit navigation links in the{" "}
              <a href="/dashboard/navigation" className="underline hover:text-neutral-900 transition-colors">
                Navigation editor
              </a>
              .
            </>
          ) : "This section has no editable settings yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
        {sectionLabels[section.type]}
      </p>

      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={props[field.key]}
          categories={categories}
          onChange={(val) => onChange(field.key, val)}
        />
      ))}
    </div>
  );
}
