"use client";

import { useState, useEffect } from "react";
import { NavItem } from "@/lib/types/sections";

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

  useEffect(() => { setLocal(externalValue); }, [externalValue]);

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

function validateHref(href: string, allItems: NavItem[], currentId: string): string | null {
  if (!href.trim()) return "URL cannot be empty.";
  if (!href.startsWith("/") && !href.startsWith("http")) return 'Must start with "/" or "http".';
  if (collectHrefs(allItems, currentId).includes(href.trim())) return "This URL is already used by another link.";
  return null;
}

export default function ItemEditor({
  item, allItems, categories, shopSlug,
  onLabelChange, onHrefChange, onTypeChange, onDelete, onAddChild,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentHref = item?.type === "link" ? item.href : (item?.type === "group" ? (item.href ?? "") : "");

  const [localLabel, setLocalLabel] = useDebounced(item?.label ?? "", onLabelChange);
  const [localHref, setLocalHref] = useDebounced(currentHref, onHrefChange);

  useEffect(() => { setConfirmDelete(false); }, [item?.id]);

  const isGroup = item?.type === "group";
  const childCount = isGroup ? item.children.length : 0;

  const hrefError = item?.type === "link"
    ? validateHref(localHref, allItems, item.id)
    : null;

  // Suggestions: Home + categories
  const suggestions = [
    { label: "Home", href: "/" },
    ...categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
  ];

  if (!item) {
    return (
      <div className="pt-2">
        <p className="text-[11px] tracking-widest uppercase text-zinc-300">No item selected</p>
        <p className="text-[11px] text-zinc-400 mt-2">Select an item from the tree, or create one using the buttons on the left.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 pb-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">Editing</p>
          <p className="text-sm font-semibold text-zinc-900 truncate">{item.label}</p>
        </div>
        <span className="text-[10px] text-zinc-300 font-mono shrink-0 ml-4 mt-1">{item.id.slice(0, 8)}</span>
      </div>

      {/* Label */}
      <Field label="Label">
        <input
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          className="w-full border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors font-mono"
          placeholder="Label"
        />
      </Field>

      {/* Type toggle */}
      <Field
        label="Type"
        hint={isGroup && childCount > 0 ? `Converting to link will remove ${childCount} child${childCount !== 1 ? "ren" : ""}.` : undefined}
        hintWarning={isGroup && childCount > 0}
      >
        <div className="flex border border-zinc-200">
          <TypeButton active={!isGroup} onClick={() => isGroup && onTypeChange("link")}>Link</TypeButton>
          <TypeButton active={isGroup} onClick={() => !isGroup && onTypeChange("group")}>Group</TypeButton>
        </div>
      </Field>

      {/* URL — required for links, optional for groups */}
      <Field
        label={isGroup ? "URL (optional — makes group clickable)" : "URL"}
        hint={hrefError ?? undefined}
        hintWarning={!!hrefError}
      >
        <input
          value={localHref}
          onChange={(e) => setLocalHref(e.target.value)}
          className={`w-full border px-3 py-2 text-sm text-zinc-900 focus:outline-none transition-colors font-mono ${
            hrefError ? "border-red-300 focus:border-red-500" : "border-zinc-200 focus:border-zinc-900"
          }`}
          placeholder={isGroup ? "Leave empty or enter /collections/watches" : "/path or https://..."}
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
        <Field label="Children">
          <div className="flex items-center gap-4">
            <button
              onClick={onAddChild}
              className="text-[11px] tracking-widest uppercase px-4 py-2 border border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
            >
              + Add child link
            </button>
            <span className="text-[11px] text-zinc-400">{childCount} {childCount === 1 ? "child" : "children"}</span>
          </div>
        </Field>
      )}

      {/* Delete */}
      <div className="pt-6 border-t border-zinc-100">
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="text-[11px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors">
            Delete item
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-zinc-500">Are you sure?</span>
            <button
              onClick={() => { setConfirmDelete(false); onDelete(); }}
              className="text-[11px] tracking-widest uppercase text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Yes, delete
            </button>
            <button onClick={() => setConfirmDelete(false)} className="text-[11px] tracking-widest uppercase text-zinc-400 hover:text-zinc-700 transition-colors">
              Cancel
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
