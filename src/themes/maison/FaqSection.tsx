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
          <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)] mb-12`}>
            {title}
          </h2>
        )}
        <div>
          {items.map((item, i) => (
            <div key={i} className="border-t border-[var(--subtle)] last:border-b">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className="text-sm tracking-[0.05em] text-[var(--primary)] group-hover:opacity-70 transition-opacity pr-8">
                  {item.question}
                </span>
                <span className="text-[var(--muted)] shrink-0 text-xs tracking-[0.1em]">
                  {openIndex === i ? "Close" : "Open"}
                </span>
              </button>
              {openIndex === i && (
                <div className="pb-7">
                  <p className="text-sm text-[var(--muted)] italic leading-[1.9]">
                    {item.answer}
                  </p>
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
