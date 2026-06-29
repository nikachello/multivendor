"use client";

import { useState } from "react";
import { IngredientsSectionProps } from "@/lib/types/sections";
import { ThemeConfig } from "@/themes/types";

type Props = IngredientsSectionProps & { themeConfig: ThemeConfig };

export default function IngredientsSection({
  title,
  subtitle,
  items = [],
  themeConfig,
}: Props) {
  const [open, setOpen] = useState<number>(0);

  return (
    <section
      className={`${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx}`}
      style={{ backgroundColor: "var(--sage, #E7EDE0)" }}
    >
      <div className="max-w-[760px] mx-auto">
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

        <div className="flex flex-col gap-2">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden"
                style={{
                  backgroundColor: "var(--page-bg)",
                  borderRadius: "var(--radius)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-jakarta font-semibold text-[15px] text-[#2C2530]">
                    {item.name}
                  </span>
                  <span
                    className="font-jakarta text-[20px] leading-none text-[var(--accent)] ml-4 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "240px" : "0" }}
                >
                  <p className={`${themeConfig.type.body} px-6 pb-6`}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
