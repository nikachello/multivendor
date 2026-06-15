import Image from "next/image";
import { GallerySectionProps } from "@/lib/types/sections";

export default function GallerySection({ images = [], columns = 3 }: GallerySectionProps) {
  if (images.length === 0) {
    return (
      <section className="py-10">
        <p className="text-center text-sm text-neutral-400">No images added yet.</p>
      </section>
    );
  }

  const gridCols: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <section className="py-10">
      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square overflow-hidden bg-neutral-100" style={{ borderRadius: "calc(var(--radius) * 2)" }}>
            {img.url && (
              <Image
                src={img.url}
                alt={img.alt || ""}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
