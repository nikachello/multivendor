import { useRef, useState } from "react";
import { NavItem } from "@/lib/types/sections";

type Props = {
  items: NavItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  onDelete?: (id: string) => void;
  onMove?: (itemId: string, targetGroupId: string) => void;
  level?: number;
  // internal: passed down during recursion so root-level drops work
  _rootItems?: NavItem[];
  _onRootReorder?: (draggedId: string, overId: string) => void;
};

export default function MenuTree({
  items,
  selectedId,
  onSelect,
  onAddChild,
  onDelete,
  onMove,
  level = 0,
}: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragNode = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    dragNode.current = id;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggedId) setOverId(id);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: NavItem
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceId = e.dataTransfer.getData("text/plain");

    if (!sourceId || sourceId === targetItem.id) {
      resetDrag();
      return;
    }

    if (targetItem.type === "group" && onMove) {
      onMove(sourceId, targetItem.id);
    }

    resetDrag();
  };

  const handleDragEnd = () => resetDrag();

  const resetDrag = () => {
    setDraggedId(null);
    setOverId(null);
    dragNode.current = null;
  };

  return (
    <div className="select-none">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const isDragging = item.id === draggedId;
        const isOver = item.id === overId && item.type === "group";

        return (
          <div key={item.id}>
            {/* Row */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelect(item.id)}
              className={[
                "group flex items-center justify-between text-[11px] cursor-pointer transition-colors border-b border-zinc-100",
                "pr-3",
                isSelected
                  ? "bg-zinc-900 text-white"
                  : isOver
                  ? "bg-zinc-100"
                  : "hover:bg-zinc-50 text-zinc-700",
                isDragging ? "opacity-30" : "opacity-100",
              ].join(" ")}
              style={{
                paddingLeft: `${16 + level * 16}px`,
                paddingTop: "9px",
                paddingBottom: "9px",
              }}
            >
              {/* Left: drag handle + label + type badge */}
              <div className="flex items-center gap-2 min-w-0">
                {/* Drag handle */}
                <span
                  className={`shrink-0 cursor-grab active:cursor-grabbing ${
                    isSelected
                      ? "text-zinc-400"
                      : "text-zinc-300 group-hover:text-zinc-400"
                  }`}
                  title="დააჭირეთ და გადაიტანეთ"
                >
                  ⠿
                </span>

                {/* Group indent indicator */}
                {item.type === "group" && (
                  <span
                    className={`shrink-0 ${
                      isSelected ? "text-zinc-400" : "text-zinc-300"
                    }`}
                  >
                    ▸
                  </span>
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

              {/* Right: action buttons (hover only) */}
              <div
                className={`flex items-center gap-3 ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.type === "group" && (
                  <button
                    onClick={() => onAddChild?.(item.id)}
                    className={`text-[10px] tracking-wide ${
                      isSelected
                        ? "text-zinc-300 hover:text-white"
                        : "text-zinc-400 hover:text-zinc-900"
                    } transition-colors`}
                    title="შვილობილი ლინკის დამატება"
                  >
                    + ლინკი
                  </button>
                )}

                <button
                  onClick={() => onDelete?.(item.id)}
                  className={`text-[10px] tracking-wide ${
                    isSelected
                      ? "text-red-400 hover:text-red-200"
                      : "text-red-400 hover:text-red-600"
                  } transition-colors`}
                  title="წაშლა"
                >
                  წაშლა
                </button>
              </div>
            </div>

            {/* Drop zone hint when dragging over a group */}
            {isOver && <div className="h-px bg-zinc-400 mx-4" />}

            {/* Children */}
            {item.type === "group" && (item.children?.length ?? 0) > 0 && (
              <MenuTree
                items={item.children!}
                selectedId={selectedId}
                onSelect={onSelect}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onMove={onMove}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
