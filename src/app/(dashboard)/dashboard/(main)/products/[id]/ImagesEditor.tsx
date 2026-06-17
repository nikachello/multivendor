"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUploader from "@/components/ui/ImageUploader";
import { addProductImages, deleteProductImage } from "@/lib/actions/products";

type Image = { id: string; url: string; altText: string | null };

type Props = {
  productId: string;
  images: Image[];
  onUpdate: () => void;
};

export default function ImagesEditor({ productId, images, onUpdate }: Props) {
  async function handleUploadComplete(urls: string[]) {
    const result = await addProductImages(productId, urls);
    if (!result.ok) { toast.error("Failed to save images"); return; }
    toast.success(`${urls.length} image(s) uploaded`);
    onUpdate();
  }

  async function handleDelete(imageId: string) {
    const result = await deleteProductImage(imageId);
    if (!result.ok) { toast.error("Failed to delete image"); return; }
    onUpdate();
  }

  return (
    <div className="flex flex-col gap-4">
      <ImageUploader onUploadComplete={handleUploadComplete} />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="w-24 h-24 object-cover rounded border border-gray-200"
              />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
