import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { GallerySectionProps } from "@/lib/types/sections";

type Props = GallerySectionProps & { themeConfig: ThemeConfig };

const GallerySection = ({
  images = [],
  columns = 3,
  themeConfig,
}: Props) => {
  if (!images.length) return null;

  const colMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid ${colMap[columns] ?? "grid-cols-2 md:grid-cols-3"} gap-2 md:gap-3`}>
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden bg-neutral-50 group"
            style={{ aspectRatio: i % 3 === 0 ? "1/1" : "4/5" }}
          >
            {img.url ? (
              <Image
                src={img.url}
                alt={img.alt ?? `Gallery image ${i + 1}`}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-neutral-100" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
