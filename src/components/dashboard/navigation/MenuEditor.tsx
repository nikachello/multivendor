"use client";

import { useState, useCallback } from "react";

import MenuTree from "./MenuTree";
import ItemEditor from "./ItemEditor";

import { mainMenu } from "@/lib/mock-data";

import { findItem } from "@/lib/navigation/find-item";
import { createItem } from "@/lib/navigation/create-item";
import { addItem } from "@/lib/navigation/add-item";
import { updateItem } from "@/lib/navigation/update-item";
import { deleteItem } from "@/lib/navigation/delete-item";
import { moveItem } from "@/lib/navigation/move-item";
import { NavItem } from "@/lib/types/sections";
import { containsId } from "@/lib/navigation/contains-id";

export default function MenuEditor() {
  const [menu, setMenu] = useState<NavItem[]>(mainMenu);
  const [savedMenu, setSavedMenu] = useState<NavItem[]>(mainMenu);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = selectedId ? findItem(menu, selectedId) : null;

  const isDirty = JSON.stringify(menu) !== JSON.stringify(savedMenu);

  // ─── Creation ────────────────────────────────────────────────────────────────

  const handleAddRoot = useCallback((type: "link" | "group") => {
    const newItem = createItem(type);
    setMenu((current) => addItem(current, newItem));
    setSelectedId(newItem.id);
  }, []);

  const handleAddChild = useCallback((parentId: string) => {
    const newItem = createItem("link");
    setMenu((current) => addItem(current, newItem, parentId));
    setSelectedId(newItem.id);
  }, []);

  // ─── Deletion ─────────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    (id: string) => {
      setMenu((current) => deleteItem(current, id));

      // Clear selection if deleted item was or contained the selected item
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
      setMenu((current) =>
        updateItem(current, selectedItem.id, { label: value })
      );
    },
    [selectedItem]
  );

  const handleHrefChange = useCallback(
    (value: string) => {
      if (!selectedItem) return;
      setMenu((current) =>
        updateItem(current, selectedItem.id, { href: value })
      );
    },
    [selectedItem]
  );

  const handleTypeChange = useCallback(
    (newType: "link" | "group") => {
      if (!selectedItem) return;

      if (newType === "group") {
        // link → group: drop href, add empty children
        setMenu((current) =>
          updateItem(current, selectedItem.id, {
            type: "group",
            href: undefined,
            children: [],
          } as Partial<NavItem>)
        );
      } else {
        // group → link: drop children, add default href
        setMenu((current) =>
          updateItem(current, selectedItem.id, {
            type: "link",
            href: "/",
            children: undefined,
          } as Partial<NavItem>)
        );
      }
    },
    [selectedItem]
  );

  // ─── Drag & Drop reorder ──────────────────────────────────────────────────────

  const handleMove = useCallback((itemId: string, targetGroupId: string) => {
    setMenu((current) => moveItem(current, itemId, targetGroupId));
  }, []);

  // ─── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    setSavedMenu(menu);
    // TODO: wire up Prisma call here
  }, [menu]);

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
            ნავიგაცია
          </h1>
          {isDirty && (
            <span className="text-[10px] tracking-widest uppercase text-zinc-400">
              ნავიგაცია
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              onClick={handleDiscard}
              className="text-xs px-4 py-1.5 border border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
            >
              გაუქმება
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
            შენახვა
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[300px_1fr] h-[calc(100vh-57px)]">
        {/* ── Tree panel ───────────────────────────────────────────────────────── */}
        <aside className="border-r border-zinc-200 flex flex-col">
          {/* Add root buttons */}
          <div className="flex border-b border-zinc-200">
            <button
              onClick={() => handleAddRoot("link")}
              className="flex-1 text-[11px] tracking-widest uppercase py-3 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors border-r border-zinc-200"
            >
              + ლინკი
            </button>
            <button
              onClick={() => handleAddRoot("group")}
              className="flex-1 text-[11px] tracking-widest uppercase py-3 px-4 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              + კატეგორია
            </button>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto">
            {menu.length === 0 ? (
              <div className="p-6 text-[11px] text-zinc-400 tracking-wide">
                დაამატეთ ლინკი ან კატეგორია
              </div>
            ) : (
              <MenuTree
                items={menu}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            )}
          </div>
        </aside>

        {/* ── Editor panel ─────────────────────────────────────────────────────── */}
        <main className="overflow-y-auto p-8">
          <ItemEditor
            item={selectedItem}
            allItems={menu}
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
