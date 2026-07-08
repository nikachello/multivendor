"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useT } from "@/i18n/context";

import MenuTree from "./MenuTree";
import ItemEditor from "./ItemEditor";

import { findItem } from "@/lib/navigation/find-item";
import { createItem } from "@/lib/navigation/create-item";
import { addItem } from "@/lib/navigation/add-item";
import { deleteItem } from "@/lib/navigation/delete-item";
import { containsId } from "@/lib/navigation/contains-id";
import { NavItem } from "@/lib/types/sections";
import { DropPosition, reorderItem } from "@/lib/navigation/reorder-item";
import { updateItem } from "@/lib/navigation/update-item";
import { saveNavigation } from "@/lib/actions/navigation";

type Category = { id: string; name: string; slug: string };

type Props = {
  shopId: string;
  shopSlug: string;
  initialItems: NavItem[];
  categories: Category[];
};

export default function MenuEditor({ shopId, shopSlug, initialItems, categories }: Props) {
  const t = useT();
  const [menu, setMenu] = useState<NavItem[]>(initialItems);
  const [savedMenu, setSavedMenu] = useState<NavItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = selectedId ? findItem(menu, selectedId) : null;
  const isDirty = JSON.stringify(menu) !== JSON.stringify(savedMenu);

  // ─── Creation ────────────────────────────────────────────────────────────────

  const handleAddRoot = useCallback((type: "link" | "group") => {
    const newItem = createItem(type);
    setMenu((prev) => addItem(prev, newItem));
    setSelectedId(newItem.id);
  }, []);

  const handleAddChild = useCallback((parentId: string) => {
    const newItem = createItem("link");
    setMenu((prev) => addItem(prev, newItem, parentId));
    setSelectedId(newItem.id);
  }, []);

  // ─── Deletion ─────────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    (id: string) => {
      setMenu((prev) => deleteItem(prev, id));
      if (
        selectedId &&
        (selectedId === id || containsId(menu, id, selectedId))
      ) {
        setSelectedId(null);
      }
    },
    [selectedId, menu]
  );

  // ─── Updates ──────────────────────────────────────────────────────────────────

  const handleLabelChange = useCallback(
    (value: string) => {
      if (!selectedItem) return;
      setMenu((prev) => updateItem(prev, selectedItem.id, { label: value }));
    },
    [selectedItem]
  );

  const handleHrefChange = useCallback(
    (value: string) => {
      if (!selectedItem) return;
      setMenu((prev) => updateItem(prev, selectedItem.id, { href: value }));
    },
    [selectedItem]
  );

  const handleTypeChange = useCallback(
    (newType: "link" | "group") => {
      if (!selectedItem) return;
      setMenu((prev) => updateItem(prev, selectedItem.id, { type: newType }));
    },
    [selectedItem]
  );

  // ─── Reorder ──────────────────────────────────────────────────────────────────

  const handleReorder = useCallback(
    (itemId: string, position: DropPosition) => {
      setMenu((prev) => reorderItem(prev, itemId, position));
    },
    []
  );

  // ─── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    const result = await saveNavigation(shopId, menu);
    if (!result.ok) { toast.error(t("dashboard.navigation_editor.save_failed")); return; }
    setSavedMenu(menu);
    toast.success(t("dashboard.navigation_editor.saved"));
  }, [shopId, menu, t]);

  const handleDiscard = useCallback(() => {
    setMenu(savedMenu);
    setSelectedId(null);
  }, [savedMenu]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Top bar */}
      <header className="border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold tracking-widest uppercase text-zinc-900">
            {t("dashboard.navigation_editor.title")}
          </h1>
          {isDirty && (
            <span className="text-[10px] tracking-widest uppercase text-zinc-400">
              {t("dashboard.navigation_editor.unsaved")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleDiscard}
              className="text-xs px-4 py-1.5 border border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
            >
              {t("dashboard.navigation_editor.discard")}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`text-xs px-4 py-1.5 border transition-colors ${
              isDirty
                ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700"
                : "border-zinc-200 text-zinc-300 cursor-not-allowed"
            }`}
          >
            {t("dashboard.navigation_editor.save")}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-57px)]">
        {/* Tree panel */}
        <aside className="border-r border-zinc-200 flex flex-col">
          <div className="flex border-b border-zinc-200">
            <button
              onClick={() => handleAddRoot("link")}
              className="flex-1 text-[11px] tracking-widest uppercase py-3 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-r border-zinc-200"
            >
              {t("dashboard.navigation_editor.add_link")}
            </button>
            <button
              onClick={() => handleAddRoot("group")}
              className="flex-1 text-[11px] tracking-widest uppercase py-3 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              {t("dashboard.navigation_editor.add_group")}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {menu.length === 0 ? (
              <div className="p-6 text-[11px] text-zinc-400 tracking-wide">
                {t("dashboard.navigation_editor.no_items")}
              </div>
            ) : (
              <MenuTree
                items={menu}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
                onReorder={handleReorder}
              />
            )}
          </div>
        </aside>

        {/* Editor panel */}
        <main className="overflow-y-auto p-8">
          <ItemEditor
            item={selectedItem}
            allItems={menu}
            categories={categories}
            shopSlug={shopSlug}
            onLabelChange={handleLabelChange}
            onHrefChange={handleHrefChange}
            onTypeChange={handleTypeChange}
            onDelete={() => selectedItem && handleDelete(selectedItem.id)}
            onAddChild={() => selectedItem && handleAddChild(selectedItem.id)}
          />
        </main>
      </div>
    </div>
  );
}
