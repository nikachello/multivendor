"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageUploader from "@/components/ui/ImageUploader";
import {
  addProductImages,
  deleteProductImage,
  reorderProductImages,
  setMainProductImage,
} from "@/lib/actions/products";

type Image = { id: string; url: string; altText: string | null; sortOrder: number; isMain: boolean };

type Props = {
  productId: string;
  images: Image[];
  onUpdate: () => void;
};

function DragHandle() {
  return (
    <svg
      className="w-3 h-3 text-gray-500"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

function SortableImageCard({
  image,
  onDelete,
  onSetMain,
}: {
  image: Image;
  onDelete: () => void;
  onSetMain: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group w-24 h-24 flex-shrink-0">
      <img
        src={image.url}
        alt={image.altText ?? ""}
        className="w-24 h-24 object-cover rounded border border-gray-200"
      />

      {/* Drag handle — top-left */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-5 h-5 bg-white/85 rounded flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <DragHandle />
      </div>

      {/* Delete — top-right */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>

      {/* Set main / Main badge — bottom */}
      {image.isMain ? (
        <span className="absolute bottom-1 left-1 right-1 text-center text-[10px] px-1 py-0.5 bg-gray-900 text-white rounded font-medium">
          Main
        </span>
      ) : (
        <button
          type="button"
          onClick={onSetMain}
          className="absolute bottom-1 left-1 right-1 text-center text-[10px] px-1 py-0.5 bg-white/90 text-gray-700 border border-gray-200 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Set main
        </button>
      )}
    </div>
  );
}

export default function ImagesEditor({ productId, images: initialImages, onUpdate }: Props) {
  const [images, setImages] = useState(initialImages);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  async function handleUploadComplete(urls: string[]) {
    const result = await addProductImages(productId, urls);
    if (!result.ok) { toast.error("Failed to save images"); return; }
    toast.success(`${urls.length} image(s) uploaded`);
    onUpdate();
  }

  async function handleDelete(imageId: string) {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    const result = await deleteProductImage(imageId);
    if (!result.ok) { toast.error("Failed to delete image"); onUpdate(); }
  }

  async function handleSetMain(imageId: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isMain: img.id === imageId })));
    const result = await setMainProductImage(imageId, productId);
    if (!result.ok) { toast.error("Failed to set main image"); onUpdate(); }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);

    setImages(reordered);
    await reorderProductImages(productId, reordered.map((img) => img.id));
  }

  return (
    <div className="flex flex-col gap-4">
      <ImageUploader onUploadComplete={handleUploadComplete} />

      {images.length > 0 && (
        <>
          <p className="text-xs text-gray-400">Drag to reorder. The first image is used as thumbnail unless you set a main image.</p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-3">
                {images.map((img) => (
                  <SortableImageCard
                    key={img.id}
                    image={img}
                    onDelete={() => handleDelete(img.id)}
                    onSetMain={() => handleSetMain(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
