"use client";

import { useState } from "react";
import Image from "next/image";
import { ShadePickerSectionProps } from "@/lib/types/sections";
import { ThemeConfig } from "@/themes/types";

type Props = ShadePickerSectionProps & { themeConfig: ThemeConfig };

export default function ShadePickerSection({
  title,
  subtitle,
  body,
  image,
  price,
  shades = [],
  themeConfig,
}: Props) {
  const [activeShade, setActiveShade] = useState(0);
  const shade = shades[activeShade];

  return (
    <section
      className={`${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx}`}
      style={{ backgroundColor: "var(--blush, #F1E0DA)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: product image */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "4/5",
            borderRadius: "calc(var(--radius) * 1.6)",
            background: "radial-gradient(115% 115% at 32% 26%, #FFFFFF, var(--surface, #FCF8F3))",
          }}
        >
          {image ? (
            <Image src={image} alt={title ?? "Product"} fill className="object-cover" />
          ) : null}
        </div>

        {/* Right: info + shade picker */}
        <div className="flex flex-col">
          {subtitle && (
            <p className={`${themeConfig.type.label} mb-4`}>{subtitle}</p>
          )}
          {title && (
            <h2
              className="font-jakarta font-bold text-[#2C2530] tracking-[-0.02em] leading-[1.06] mb-3"
              style={{ fontSize: "clamp(28px, 3.6vw, 42px)" }}
            >
              {title}
            </h2>
          )}
          {price !== undefined && (
            <p className="font-jakarta font-semibold text-[18px] text-[#2C2530] mb-4">
              ${price}
            </p>
          )}
          {body && (
            <p className={`${themeConfig.type.body} mb-8`}>{body}</p>
          )}

          {shades.length > 0 && (
            <div className="mb-8">
              <p className="font-jakarta font-semibold text-[13px] text-[#2C2530] mb-3">
                Shade:{" "}
                <span className="font-normal text-[var(--muted)]">
                  {shade?.name ?? ""}
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                {shades.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveShade(i)}
                    title={s.name}
                    className="w-[38px] h-[38px] rounded-full transition-all"
                    style={{
                      backgroundColor: s.color,
                      boxShadow:
                        activeShade === i
                          ? `0 0 0 2px var(--page-bg), 0 0 0 4px var(--accent)`
                          : "0 0 0 1px rgba(0,0,0,0.1)",
                    }}
                    aria-label={s.name}
                    aria-pressed={activeShade === i}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            className="w-full font-jakarta font-semibold text-[15px] text-white py-4 hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "var(--accent)",
              borderRadius: "var(--pill)",
            }}
          >
            Add to bag{price !== undefined ? ` — $${price}` : ""}
          </button>

          <p className="font-jakarta text-[12px] text-[var(--muted)] text-center mt-3">
            Free shipping over $40 · Easy returns
          </p>
        </div>
      </div>
    </section>
  );
}
