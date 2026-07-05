"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { RoutineBuilderSectionProps } from "@/lib/types/sections";
import { ThemeConfig } from "@/themes/types";

type Props = RoutineBuilderSectionProps & { themeConfig: ThemeConfig };

export default function RoutineBuilderSection({
  title,
  subtitle,
  discountPercent = 15,
  minItems = 3,
  items = [],
  themeConfig,
}: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const subtotal = useMemo(
    () => [...selected].reduce((sum, i) => sum + (items[i]?.price ?? 0), 0),
    [selected, items],
  );
  const eligible = selected.size >= minItems;
  const discount = eligible ? subtotal * (discountPercent / 100) : 0;
  const total = subtotal - discount;

  return (
    <section
      className={`${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx}`}
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <div className="max-w-5xl mx-auto">
        {subtitle && (
          <p className={`${themeConfig.type.label} text-center mb-4`}>{subtitle}</p>
        )}
        {title && (
          <h2
            className={`${themeConfig.type.sectionHeading} text-center mb-10`}
            style={{ fontSize: "clamp(26px, 4vw, 50px)" }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6">
          {/* Left: product rows */}
          <div className="flex flex-col gap-3">
            {items.map((item, i) => {
              const active = selected.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 p-4 text-left transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderRadius: "var(--radius)",
                    border: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-14 h-14 flex-shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--radius)",
                      background: "radial-gradient(115% 115% at 32% 26%, #fff, var(--sage, #E7EDE0))",
                    }}
                  >
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {item.step && (
                      <p className="font-jakarta font-bold text-[11px] tracking-[0.14em] text-[var(--accent)] mb-0.5">
                        {item.step}
                      </p>
                    )}
                    <p className="font-jakarta font-semibold text-[14px] text-[#2C2530] truncate">
                      {item.name}
                    </p>
                    <p className="font-jakarta font-semibold text-[14px] text-[var(--muted)]">
                      ${item.price}
                    </p>
                  </div>

                  {/* Check indicator */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: active ? "var(--accent)" : "var(--subtle)",
                    }}
                  >
                    {active && (
                      <span className="text-white text-[13px] leading-none">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: summary card */}
          <div
            className="flex flex-col p-6 h-fit md:sticky md:top-6"
            style={{
              backgroundColor: "#2C2530",
              borderRadius: "calc(var(--radius) * 1.4)",
              color: "#EFE8DA",
            }}
          >
            <p className="font-jakarta font-semibold text-[14px] text-white/60 mb-4">
              {selected.size} item{selected.size !== 1 ? "s" : ""} selected
            </p>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between font-jakarta text-[14px]">
                <span className="text-white/70">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-jakarta text-[14px]">
                  <span style={{ color: "var(--accent)" }}>{discountPercent}% bundle discount</span>
                  <span style={{ color: "var(--accent)" }}>−${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 mb-5">
              <div className="flex justify-between font-jakarta font-bold text-[18px] text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={selected.size === 0}
              className="w-full font-jakarta font-semibold text-[14px] py-4 text-[#2C2530] transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--accent)",
                borderRadius: "var(--pill)",
                color: "#ffffff",
              }}
            >
              Add routine to bag
            </button>

            <p className="font-jakarta text-[12px] text-white/50 text-center mt-3">
              {eligible
                ? `You're saving $${discount.toFixed(2)} ✨`
                : `Add ${minItems - selected.size} more to unlock ${discountPercent}% off`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
