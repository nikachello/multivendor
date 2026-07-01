"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { FaqSectionProps } from "@/lib/types/sections";

type Props = FaqSectionProps & { themeConfig: ThemeConfig };

const FaqSection = ({
  title = "Frequently Asked Questions",
  items = [],
  themeConfig,
}: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} max-w-3xl mx-auto`}>
        {title && (
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-neutral-900 mb-12">
            {title}
          </h2>
        )}
        <div className="divide-y divide-neutral-100">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-sm font-medium text-neutral-900 pr-8">{item.question}</span>
                  <svg
                    className={`w-4 h-4 shrink-0 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] pb-5" : "max-h-0"}`}
                >
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
