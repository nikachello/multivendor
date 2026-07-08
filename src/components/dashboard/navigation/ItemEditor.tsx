"use client";

import { useState, useEffect } from "react";
import { NavItem } from "@/lib/types/sections";
import { useT } from "@/i18n/context";

type Category = { id: string; name: string; slug: string };

type Props = {
  item: NavItem | null;
  allItems: NavItem[];
  categories: Category[];
  shopSlug: string;
  onLabelChange: (value: string) => void;
  onHrefChange: (value: string) => void;
  onTypeChange: (type: "link" | "group") => void;
  onDelete: () => void;
  onAddChild: () => void;
};

function useDebounced(externalValue: string, onChange: (v: string) => void, delay = 300) {
  const [local, setLocal] = useState(externalValue);
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue);

  // Adjust local state during render when the external value changes,
  // instead of syncing via an effect (avoids an extra render pass).
  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setLocal(externalValue);
  }

  useEffect(() => {
    if (local === externalValue) return;
    const t = setTimeout(() => onChange(local), delay);
    return () => clearTimeout(t);
  }, [local]); // eslint-disable-line react-hooks/exhaustive-deps

  return [local, setLocal] as const;
}

function collectHrefs(items: NavItem[], excludeId: string): string[] {
  const hrefs: string[] = [];
  for (const item of items) {
    if (item.type === "link" && item.id !== excludeId) hrefs.push(item.href);
    if (item.type === "group") hrefs.push(...collectHrefs(item.children, excludeId));
  }
  return hrefs;
}

function validateHref(
  href: string,
  allItems: NavItem[],
  currentId: string,
  t: (key: string) => string,
): string | null {
  if (!href.trim()) return t("dashboard.navigation_editor.url_empty");
  if (!href.startsWith("/") && !href.startsWith("http")) return t("dashboard.navigation_editor.url_invalid_start");
  if (collectHrefs(allItems, currentId).includes(href.trim())) return t("dashboard.navigation_editor.url_duplicate");
  return null;
}

export default function ItemEditor({
  item, allItems, categories, shopSlug,
  onLabelChange, onHrefChange, onTypeChange, onDelete, onAddChild,
}: Props) {
  const t = useT();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [prevItemId, setPrevItemId] = useState(item?.id);

  const currentHref = item?.type === "link" ? item.href : (item?.type === "group" ? (item.href ?? "") : "");

  const [localLabel, setLocalLabel] = useDebounced(item?.label ?? "", onLabelChange);
  const [localHref, setLocalHref] = useDebounced(currentHref, onHrefChange);

  if (item?.id !== prevItemId) {
    setPrevItemId(item?.id);
    setConfirmDelete(false);
  }

  const isGroup = item?.type === "group";
  const childCount = isGroup ? item.children.length : 0;

  const hrefError = item?.type === "link"
    ? validateHref(localHref, allItems, item.id, t)
    : null;

  // Suggestions: Home + categories
  const suggestions = [
    { label: t("dashboard.navigation_editor.home_label"), href: "/" },
    ...categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  ];

  if (!item) {
    return (
      <div className="pt-2">
        <p className="text-[11px] tracking-widest uppercase text-zinc-300">{t("dashboard.navigation_editor.no_item_selected")}</p>
        <p className="text-[11px] text-zinc-400 mt-2">{t("dashboard.navigation_editor.select_hint")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">{t("dashboard.navigation_editor.editing")}</p>
          <p className="text-sm font-semibold text-zinc-900 truncate">{item.label}</p>
        </div>
        <span className="text-[10px] text-zinc-300 font-mono shrink-0 ml-4 mt-1">{item.id.slice(0, 8)}</span>
      </div>

      {/* Label */}
      <Field label={t("dashboard.navigation_editor.label_field")}>
        <input
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          className="w-full border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors font-mono"
          placeholder={t("dashboard.navigation_editor.label_field")}
        />
      </Field>

      {/* Type toggle */}
      <Field
        label={t("dashboard.navigation_editor.type_field")}
        hint={isGroup && childCount > 0 ? (childCount === 1 ? t("dashboard.navigation_editor.type_convert_one") : t("dashboard.navigation_editor.type_convert_many", { n: childCount })) : undefined}
        hintWarning={isGroup && childCount > 0}
      >
        <div className="flex border border-zinc-200">
          <TypeButton active={!isGroup} onClick={() => isGroup && onTypeChange("link")}>{t("dashboard.navigation_editor.link_type_btn")}</TypeButton>
          <TypeButton active={isGroup} onClick={() => !isGroup && onTypeChange("group")}>{t("dashboard.navigation_editor.group_type_btn")}</TypeButton>
        </div>
      </Field>

      {/* URL — required for links, optional for groups */}
      <Field
        label={isGroup ? t("dashboard.navigation_editor.url_optional") : t("dashboard.navigation_editor.url_field")}
        hint={hrefError ?? undefined}
        hintWarning={!!hrefError}
      >
        <input
          value={localHref}
          onChange={(e) => setLocalHref(e.target.value)}
          className={`w-full border px-3 py-2 text-sm text-zinc-900 focus:outline-none transition-colors font-mono ${
            hrefError ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
          }`}
          placeholder={isGroup ? t("dashboard.navigation_editor.url_placeholder_group") : t("dashboard.navigation_editor.url_placeholder_link")}
        />
        {/* Preview */}
        {localHref && (
          <p className="text-[10px] text-zinc-400 mt-1 font-mono">
            → /shop/{shopSlug}{localHref === "/" ? "" : localHref}
          </p>
        )}
        {/* Suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.map((s) => (
            <button
              key={s.href}
              type="button"
              onClick={() => setLocalHref(s.href)}
              className={`text-[10px] px-2 py-0.5 border rounded transition-colors ${
                localHref === s.href
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Add child (groups only) */}
      {isGroup && (
        <Field label={t("dashboard.navigation_editor.children_field")}>
          <div className="flex items-center gap-4">
            <button
              onClick={onAddChild}
              className="text-[11px] tracking-widest uppercase px-4 py-2 border border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
            >
              {t("dashboard.navigation_editor.add_child")}
            </button>
            <span className="text-[11px] text-zinc-400">{childCount === 1 ? t("dashboard.navigation_editor.child_count_one") : t("dashboard.navigation_editor.child_count_many", { n: childCount })}</span>
          </div>
        </Field>
      )}

      {/* Delete */}
      <div className="pt-6 border-t border-zinc-100">
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="text-[11px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors">
            {t("dashboard.navigation_editor.delete_item")}
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-500">{t("dashboard.navigation_editor.confirm_delete")}</span>
            <button
              onClick={() => { setConfirmDelete(false); onDelete(); }}
              className="text-[11px] tracking-widest uppercase text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              {t("dashboard.navigation_editor.yes_delete")}
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-[11px] tracking-widest uppercase text-zinc-400 hover:text-zinc-700 transition-colors">
              {t("common.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, hintWarning, children }: { label: string; hint?: string; hintWarning?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] tracking-widest uppercase text-zinc-400">{label}</p>
      {children}
      {hint && <p className={`text-[11px] ${hintWarning ? "text-red-400" : "text-zinc-400"}`}>{hint}</p>}
    </div>
  );
}

function TypeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-[11px] tracking-widest uppercase transition-colors ${
        active ? "bg-zinc-900 text-white cursor-default" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}
