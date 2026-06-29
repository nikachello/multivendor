"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { FaqSectionProps } from "@/lib/types/sections";

type Props = FaqSectionProps & { themeConfig: ThemeConfig };

const FaqSection = ({ title = "Frequently asked questions", items = [], themeConfig }: Props) => {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} max-w-2xl mx-auto`}>
        {title && (
          <h2 className={`${themeConfig.type.sectionHeading} mb-12`}>{title}</h2>
        )}
        <div className="divide-y divide-[var(--subtle)]">
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between py-5 text-left ${themeConfig.type.body}`}
              >
                <span>{item.question}</span>
                <span className="ml-4 text-[var(--muted)] text-lg leading-none flex-shrink-0">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className={themeConfig.type.body}>{item.answer}</p>
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
