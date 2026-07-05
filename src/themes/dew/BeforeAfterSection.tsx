"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { BeforeAfterSectionProps } from "@/lib/types/sections";
import { ThemeConfig } from "@/themes/types";

type Props = BeforeAfterSectionProps & { themeConfig: ThemeConfig };

export default function BeforeAfterSection({
  title,
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  themeConfig,
}: Props) {
  const [value, setValue] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!(e.buttons & 1)) return;
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setValue(pct);
  }, []);

  return (
    <section
      className={`${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx}`}
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      {title && (
        <h2
          className={`${themeConfig.type.sectionHeading} text-center mb-8 md:mb-12`}
          style={{ fontSize: "clamp(26px, 4vw, 50px)" }}
        >
          {title}
        </h2>
      )}

      <div className="max-w-3xl mx-auto">
        <div
          ref={trackRef}
          className="relative overflow-hidden select-none touch-none cursor-ew-resize"
          style={{
            aspectRatio: "16/10",
            borderRadius: "calc(var(--radius) * 1.6)",
            background: "radial-gradient(115% 115% at 32% 26%, #FFFFFF, var(--sage, #E7EDE0))",
          }}
          onPointerMove={handlePointerMove}
          onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
        >
          {/* Before layer (full) */}
          <div className="absolute inset-0">
            {beforeImage ? (
              <Image src={beforeImage} alt={beforeLabel} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-end justify-start p-4">
                <span className="font-mono text-[11px] text-[var(--muted)] tracking-widest uppercase">{beforeLabel}</span>
              </div>
            )}
          </div>

          {/* After layer (clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          >
            {afterImage ? (
              <Image src={afterImage} alt={afterLabel} fill className="object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-end justify-end p-4"
                style={{ background: "radial-gradient(115% 115% at 70% 26%, #E7DCEF, #D9D2F2)" }}
              >
                <span className="font-mono text-[11px] text-[var(--muted)] tracking-widest uppercase">{afterLabel}</span>
              </div>
            )}
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white pointer-events-none"
            style={{ left: `${value}%` }}
          />

          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center pointer-events-none"
            style={{ left: `${value}%`, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
          >
            <span className="text-[#2C2530] text-[16px] leading-none select-none">↔</span>
          </div>

          {/* Corner labels */}
          <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/80 pointer-events-none">
            {beforeLabel}
          </span>
          <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/80 pointer-events-none">
            {afterLabel}
          </span>
        </div>

        {/* Range input (accessible, hidden visually) */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full mt-4 accent-[var(--accent)]"
          aria-label="Before/after comparison slider"
        />
      </div>
    </section>
  );
}
