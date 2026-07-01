import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { GallerySectionProps } from "@/lib/types/sections";

type Props = GallerySectionProps & { themeConfig: ThemeConfig };

const COL_CLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const GallerySection = ({ images = [], columns = 3, themeConfig }: Props) => {
  if (!images.length) return null;

  const colsCls = COL_CLS[columns] ?? COL_CLS[3];

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx}`}>
        <div className={`grid ${colsCls} gap-0`}>
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "1/1" }}
            >
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
      </div>
    </section>
  );
};

export default GallerySection;
