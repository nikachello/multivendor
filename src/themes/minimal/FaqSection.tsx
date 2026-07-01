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
      <div className={`${themeConfig.layout.contentPx} max-w-2xl`}>
        {title && (
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-10">
            {title}
          </p>
        )}
        <div>
          {items.map((item, i) => (
            <div key={i} className="border-t border-neutral-100 last:border-b">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-neutral-900">{item.question}</span>
                <span className="text-neutral-400 ml-4 shrink-0 text-lg leading-none">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="pb-5">
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.answer}</p>
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
