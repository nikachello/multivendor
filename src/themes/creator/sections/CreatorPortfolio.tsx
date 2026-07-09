"use client";

import { useState } from "react";
import Image from "next/image";

type PortfolioImage = { id: string; url: string; alt?: string };

type Props = {
  title?: string;
  images?: PortfolioImage[];
};

export default function CreatorPortfolio({ title, images = [] }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--creator-muted)] mb-3">
          {title}
        </p>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightboxSrc(img.url)}
            className="aspect-square overflow-hidden rounded-lg bg-[var(--creator-subtle)] block"
            aria-label={img.alt ?? "View image"}
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              width={200}
              height={200}
              className="w-full h-full object-cover active:scale-95 transition-transform"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={lightboxSrc}
              alt="Portfolio image"
              width={800}
              height={800}
              className="object-contain max-h-[90vh] w-auto"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
