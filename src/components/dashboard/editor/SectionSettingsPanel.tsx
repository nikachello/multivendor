"use client";

import { ShopSection } from "@/lib/types/store-section";
import { FieldDef, FlatFieldDef } from "@/lib/editor-schema";
import { SectionMeta } from "@/themes/types";
import { useUploadThing } from "@/lib/uploadthing-client";
import { useRef } from "react";
import { useT } from "@/i18n/context";

function ImageUploadField({ label, value, onChange }: { label: string; value: unknown; onChange: (val: unknown) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const current = typeof value === "string" ? value : "";
  const t = useT();

  const { startUpload, isUploading } = useUploadThing("sectionImage", {
    onClientUploadComplete: (res) => {
      if (res[0]) onChange(res[0].ufsUrl);
    },
  });

  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1.5">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) startUpload([file]);
        e.target.value = "";
      }} />
      {current && (
        <img src={current} alt="" className="w-full h-32 object-cover mb-2 border border-neutral-200" />
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full border border-neutral-200 hover:border-neutral-500 py-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-50"
      >
        {isUploading
          ? t("dashboard.section_panel.uploading")
          : current
            ? t("dashboard.section_panel.replace_image")
            : t("dashboard.section_panel.upload_image")}
      </button>
    </div>
  );
}

type ShopCategory = { id: string; name: string; slug?: string };
type ShopPage = { slug: string; title: string };

type Props = {
  section: ShopSection;
  shopId: string;
  categories: ShopCategory[];
  pages: ShopPage[];
  sectionMeta: SectionMeta[];
  onChange: (key: string, value: unknown) => void;
};

function LinkSuggestions({
  value,
  categories,
  pages,
  onSelect,
}: {
  value: string;
  categories: ShopCategory[];
  pages: ShopPage[];
  onSelect: (href: string) => void;
}) {
  const groups = [
    {
      label: "Pages",
      items: [
        { label: "Home", href: "/" },
        ...pages.map((p) => ({ label: p.title, href: `/p/${p.slug}` })),
      ],
    },
    {
      label: "Collections",
      items: categories.map((c) => ({ label: c.name, href: `/collections/${c.slug ?? c.name.toLowerCase().replace(/\s+/g, "-")}` })),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-2 mt-1.5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-[9px] tracking-widest uppercase text-neutral-300 mb-1">{group.label}</p>
          <div className="flex flex-wrap gap-1">
            {group.items.map((s) => (
              <button
                key={s.href}
                type="button"
                onClick={() => onSelect(s.href)}
                className={`text-[10px] px-2 py-0.5 border rounded transition-colors ${
                  value === s.href
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="text-[10px] text-neutral-400">Or type any URL — <span className="font-mono">https://instagram.com/…</span></p>
    </div>
  );
}

function FlatField({
  field,
  value,
  onChange,
  categories,
  pages,
}: {
  field: FlatFieldDef;
  value: unknown;
  onChange: (val: unknown) => void;
  categories: ShopCategory[];
  pages: ShopPage[];
}) {
  const labelCls = "block text-xs font-medium text-neutral-600 mb-1.5";
  const inputCls = "w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors";

  const isUrlField = field.key.toLowerCase().endsWith("url") || field.key.toLowerCase().endsWith("href") || field.key.toLowerCase().endsWith("link");

  if (field.type === "image-upload") {
    return <ImageUploadField label={field.label} value={value} onChange={onChange} />;
  }

  if (field.type === "text") {
    const str = typeof value === "string" ? value : "";
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <input
          type="text"
          value={str}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        {isUrlField && (
          <LinkSuggestions value={str} categories={categories} pages={pages} onSelect={onChange} />
        )}
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

function Field({
  field,
  value,
  categories,
  pages,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  categories: ShopCategory[];
  pages: ShopPage[];
  onChange: (val: unknown) => void;
}) {
  const t = useT();

  if (
    field.type === "text" ||
    field.type === "textarea" ||
    field.type === "color" ||
    field.type === "select" ||
    field.type === "image-upload"
  ) {
    return <FlatField field={field} value={value} onChange={onChange} categories={categories} pages={pages} />;
  }

  if (field.type === "select-shop-categories") {
    return (
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">{field.label}</label>
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-500 transition-colors bg-white"
        >
          <option value="">{t("dashboard.section_panel.select_category")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "multiselect-shop-categories") {
    const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">{field.label}</label>
        {categories.length === 0 ? (
          <p className="text-xs text-neutral-400">{t("dashboard.section_panel.no_categories")}</p>
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
            {t("dashboard.section_panel.clear_selection")}
          </button>
        )}
      </div>
    );
  }

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
            {t("dashboard.section_panel.add_item")}
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-xs text-neutral-400 text-center py-3 border border-dashed border-neutral-200">
            {t("dashboard.section_panel.no_items")}
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
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
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
                    categories={categories}
                    pages={pages}
                    onChange={(val) =>
                      onChange(items.map((it, i) => (i === idx ? { ...it, [f.key]: val } : it)))
                    }
                  />
                ))}
                <button
                  onClick={() => onChange(items.filter((_, i) => i !== idx))}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  {t("dashboard.section_panel.remove_item")}
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

export default function SectionSettingsPanel({ section, shopId, categories, pages, sectionMeta, onChange }: Props) {
  void shopId;
  const t = useT();
  const meta = sectionMeta.find((m) => m.type === section.type);
  const fields = meta?.fieldSchema ?? [];
  const label = meta?.label ?? section.type;
  const props = section.props;

  if (fields.length === 0) {
    return (
      <div className="p-5 text-sm text-neutral-400">
        <p className="font-medium text-neutral-600 mb-1">{label}</p>
        <p>
          {section.type === "navbar" ? (
            <>
              {t("dashboard.section_panel.nav_edit")}{" "}
              <a href="/dashboard/navigation" className="underline hover:text-neutral-900 transition-colors">
                {t("dashboard.section_panel.nav_editor")}
              </a>
              .
            </>
          ) : t("dashboard.section_panel.no_settings")}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">{label}</p>
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={props[field.key]}
          categories={categories}
          pages={pages}
          onChange={(val) => onChange(field.key, val)}
        />
      ))}
    </div>
  );
}
