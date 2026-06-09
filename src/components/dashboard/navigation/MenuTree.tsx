"use client";

import { useState, useCallback } from "react";
import { NavItem } from "@/lib/types/sections";
import { DropPosition } from "@/lib/navigation/reorder-item";

// ─── Types ────────────────────────────────────────────────────────────────────

type DropIndicator = {
  relativeToId: string | null;
  parentId: string | null;
  placement: "before" | "after";
};

type Props = {
  items: NavItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (draggedId: string, position: DropPosition) => void;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getPlacement(e: React.DragEvent<HTMLElement>): "before" | "after" {
  const rect = e.currentTarget.getBoundingClientRect();
  return e.clientY < rect.top + rect.height / 2 ? "before" : "after";
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function MenuTree({
  items,
  selectedId,
  onSelect,
  onAddChild,
  onDelete,
  onReorder,
}: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDropIndicator(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>, indicator: DropIndicator) => {
      e.preventDefault();
      e.stopPropagation();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId) return;
      setDraggedId(null);
      setDropIndicator(null);
      onReorder?.(sourceId, indicator);
    },
    [onReorder]
  );

  return (
    <TreeLevel
      items={items}
      parentId={null}
      level={0}
      selectedId={selectedId}
      draggedId={draggedId}
      dropIndicator={dropIndicator}
      onSelect={onSelect}
      onAddChild={onAddChild}
      onDelete={onDelete}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onSetDropIndicator={setDropIndicator}
    />
  );
}

// ─── TreeLevel ────────────────────────────────────────────────────────────────

type TreeLevelProps = {
  items: NavItem[];
  parentId: string | null;
  level: number;
  selectedId: string | null;
  draggedId: string | null;
  dropIndicator: DropIndicator | null;
  onSelect: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  onDelete?: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLElement>, indicator: DropIndicator) => void;
  onSetDropIndicator: (indicator: DropIndicator | null) => void;
};

function TreeLevel({
  items,
  parentId,
  level,
  selectedId,
  draggedId,
  dropIndicator,
  onSelect,
  onAddChild,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
  onSetDropIndicator,
}: TreeLevelProps) {
  const endZoneActive =
    dropIndicator?.parentId === parentId &&
    dropIndicator?.relativeToId === null;

  return (
    <div>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const isDragging = item.id === draggedId;

        const showBefore =
          dropIndicator?.relativeToId === item.id &&
          dropIndicator?.parentId === parentId &&
          dropIndicator?.placement === "before";

        const showAfter =
          dropIndicator?.relativeToId === item.id &&
          dropIndicator?.parentId === parentId &&
          dropIndicator?.placement === "after";

        const isGroupTarget =
          item.type === "group" &&
          dropIndicator?.parentId === item.id &&
          dropIndicator?.relativeToId === null;

        return (
          <div key={item.id}>
            {/* Drop line: before */}
            <DropLine active={showBefore} level={level} />

            {/* Row */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const rect = e.currentTarget.getBoundingClientRect();
                const relY = (e.clientY - rect.top) / rect.height;

                // Middle 40% of a group → drop INTO the group
                if (item.type === "group" && relY > 0.3 && relY < 0.7) {
                  onSetDropIndicator({
                    relativeToId: null,
                    parentId: item.id,
                    placement: "after",
                  });
                } else {
                  onSetDropIndicator({
                    relativeToId: item.id,
                    parentId,
                    placement: getPlacement(e),
                  });
                }
              }}
              onDrop={(e) => {
                if (dropIndicator) onDrop(e, dropIndicator);
              }}
              onClick={() => onSelect(item.id)}
              className={[
                "group flex items-center justify-between text-[11px] cursor-pointer transition-colors border-b border-zinc-100 pr-3",
                isSelected
                  ? "bg-zinc-900 text-white"
                  : isGroupTarget
                  ? "bg-zinc-100"
                  : "hover:bg-zinc-50 text-zinc-700",
                isDragging ? "opacity-25" : "opacity-100",
              ].join(" ")}
              style={{
                paddingLeft: `${16 + level * 16}px`,
                paddingTop: "9px",
                paddingBottom: "9px",
              }}
            >
              {/* Left */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`shrink-0 cursor-grab active:cursor-grabbing text-base leading-none ${
                    isSelected
                      ? "text-zinc-400"
                      : "text-zinc-300 group-hover:text-zinc-400"
                  }`}
                >
                  ⠿
                </span>

                {item.type === "group" && (
                  <span className="shrink-0 text-[10px] text-zinc-400">▸</span>
                )}

                <span className="truncate tracking-wide">{item.label}</span>

                <span
                  className={`shrink-0 text-[9px] tracking-widest uppercase ${
                    isSelected ? "text-zinc-400" : "text-zinc-300"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              {/* Right: actions */}
              <div
                className={`flex items-center gap-3 transition-opacity ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.type === "group" && (
                  <button
                    onClick={() => onAddChild?.(item.id)}
                    className={`text-[10px] tracking-wide transition-colors ${
                      isSelected
                        ? "text-zinc-300 hover:text-white"
                        : "text-zinc-400 hover:text-zinc-900"
                    }`}
                  >
                    + child
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(item.id)}
                  className={`text-[10px] tracking-wide transition-colors ${
                    isSelected
                      ? "text-red-400 hover:text-red-200"
                      : "text-red-400 hover:text-red-600"
                  }`}
                >
                  del
                </button>
              </div>
            </div>

            {/* Drop line: after */}
            <DropLine active={showAfter} level={level} />

            {/* Children */}
            {item.type === "group" && item.children.length > 0 && (
              <TreeLevel
                items={item.children}
                parentId={item.id}
                level={level + 1}
                selectedId={selectedId}
                draggedId={draggedId}
                dropIndicator={dropIndicator}
                onSelect={onSelect}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                onSetDropIndicator={onSetDropIndicator}
              />
            )}

            {/* Empty group drop target */}
            {item.type === "group" &&
              item.children.length === 0 &&
              isGroupTarget && (
                <div
                  className="my-1 mr-4 border border-dashed border-zinc-300 text-[10px] text-zinc-400 text-center py-1.5 tracking-widest uppercase"
                  style={{ marginLeft: `${16 + (level + 1) * 16}px` }}
                >
                  Drop here
                </div>
              )}
          </div>
        );
      })}

      {/* End-of-list drop zone */}
      {draggedId && (
        <div
          className="h-6"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSetDropIndicator({
              relativeToId: null,
              parentId,
              placement: "after",
            });
          }}
          onDrop={(e) => {
            onDrop(e, { relativeToId: null, parentId, placement: "after" });
          }}
        >
          {endZoneActive && (
            <div
              className="relative h-0 pointer-events-none"
              style={{ marginLeft: `${16 + level * 16}px` }}
            >
              <div className="absolute left-0 right-4 top-3 h-0.5 bg-zinc-900" />
              <div className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full bg-zinc-900" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DropLine ─────────────────────────────────────────────────────────────────

function DropLine({ active, level }: { active: boolean; level: number }) {
  if (!active) return null;
  return (
    <div
      className="relative h-0 pointer-events-none"
      style={{ marginLeft: `${16 + level * 16}px` }}
    >
      <div className="absolute left-0 right-4 top-0 h-0.5 bg-zinc-900" />
      <div className="absolute left-0 top-[-3px] w-1.5 h-1.5 rounded-full bg-zinc-900" />
    </div>
  );
}
