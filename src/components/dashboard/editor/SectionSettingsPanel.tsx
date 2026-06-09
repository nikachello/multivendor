"use client";

import { ShopSection } from "@/lib/types/store-section";
import { sectionFieldSchema, sectionLabels } from "@/lib/data/editor-schema";

type Props = {
  section: ShopSection;
  onChange: (key: string, value: unknown) => void;
};

export default function SectionSettingsPanel({ section, onChange }: Props) {
  const fields = sectionFieldSchema[section.type];
  const props = section.props as Record<string, unknown>;

  if (!fields) {
    return (
      <div className="p-5 text-sm text-neutral-400">
        <p className="font-medium text-neutral-600 mb-1">
          {sectionLabels[section.type]}
        </p>
        <p>
          {section.type === "navbar"
            ? "Edit navigation links in the Navigation editor."
            : "This section has no editable settings yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
        {sectionLabels[section.type]}
      </p>

      {fields.map((field) => {
        const value = props[field.key];

        if (field.type === "text") {
          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                value={typeof value === "string" ? value : ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors"
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {field.label}
              </label>
              <textarea
                value={typeof value === "string" ? value : ""}
                placeholder={field.placeholder}
                rows={3}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors resize-none"
              />
            </div>
          );
        }

        if (field.type === "color") {
          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {field.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={typeof value === "string" ? value : "#000000"}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-8 h-8 border border-neutral-200 cursor-pointer rounded-sm p-0.5 bg-white"
                />
                <span className="text-xs font-mono text-neutral-500">
                  {typeof value === "string" ? value : "#000000"}
                </span>
              </div>
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {field.label}
              </label>
              <select
                value={typeof value === "string" || typeof value === "number" ? value : ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed = Number(raw);
                  onChange(field.key, isNaN(parsed) ? raw : parsed);
                }}
                className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors bg-white"
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
      })}
    </div>
  );
}
