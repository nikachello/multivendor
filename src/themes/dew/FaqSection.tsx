"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { FaqSectionProps } from "@/lib/types/sections";

type Props = FaqSectionProps & { themeConfig: ThemeConfig };

const FaqSection = ({ title, items = [], themeConfig }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} max-w-2xl mx-auto`}>
        {title && (
          <h2 className={`${themeConfig.type.sectionHeading} text-2xl mb-8`}>{title}</h2>
        )}
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-[var(--surface)] shadow-sm overflow-hidden"
              style={{ borderRadius: "var(--radius)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-[var(--primary)] pr-4">
                  {item.question}
                </span>
                <span
                  className="inline-flex items-center justify-center w-7 h-7 text-white text-base font-bold shrink-0"
                  style={{
                    backgroundColor: "var(--accent)",
                    borderRadius: "999px",
                    lineHeight: 1,
                  }}
                >
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
