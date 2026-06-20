import Image from "next/image";
import { GallerySectionProps } from "@/lib/types/sections";

const GallerySection = ({ images = [], columns = 3 }: GallerySectionProps) => {
  if (!images.length) return null;

  const colClass: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className={`px-5 md:px-10 grid ${colClass[columns] ?? colClass[3]} gap-1`}>
        {images.map((img, i) => (
          <div key={i} className="relative bg-[#E2DDD5]" style={{ aspectRatio: "1/1" }}>
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
