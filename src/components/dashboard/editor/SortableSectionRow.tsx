"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ShopSection } from "@/lib/types/store-section";
import { sectionLabels } from "@/lib/editor-schema";

type Props = {
  section: ShopSection;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
};

export default function SortableSectionRow({
  section,
  isSelected,
  onSelect,
  onRemove,
}: Props) {
  // useSortable gives us everything we need for one draggable item.
  // - attributes/listeners: spread onto the drag handle element
  // - transform/transition: applied as inline styles so dnd-kit can animate movement
  // - isDragging: true while this specific item is being dragged
  const isLocked = section.type === "navbar";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Navbar can't be removed — it's always needed
  const canRemove = section.type !== "navbar";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-3 rounded cursor-pointer select-none border transition-colors ${
        isSelected
          ? "bg-neutral-100 border-neutral-300"
          : "bg-white border-transparent hover:bg-neutral-50"
      } ${isDragging ? "shadow-lg z-50" : ""}`}
    >
      {/* Drag handle — listeners go here, not on the whole row */}
      {isLocked ? (
        <span className="p-1 text-neutral-200" title="Position locked">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </span>
      ) : (
        <button
          {...attributes}
          {...listeners}
          className="flex flex-col gap-[3px] p-1 text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
        >
          <span className="block w-3.5 h-[1.5px] bg-current" />
          <span className="block w-3.5 h-[1.5px] bg-current" />
          <span className="block w-3.5 h-[1.5px] bg-current" />
        </button>
      )}

      {/* Section label */}
      <span className="flex-1 text-sm font-medium text-neutral-700">
        {sectionLabels[section.type]}
      </span>

      {/* Type badge */}
      <span className="text-[10px] tracking-wide text-neutral-400 uppercase">
        {section.type}
      </span>

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 text-neutral-300 hover:text-red-400 transition-colors"
          aria-label="Remove section"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
