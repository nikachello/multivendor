"use client";

import { useState } from "react";
import { FaqSectionProps } from "@/lib/types/sections";

const FaqSection = ({ title = "Frequently asked questions", items = [] }: FaqSectionProps) => {
  const [open, setOpen] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10 max-w-2xl mx-auto">
        {title && (
          <h2 className="font-display text-3xl font-light text-[#1C1C1C] mb-12">
            {title}
          </h2>
        )}
        <div className="divide-y divide-[#E2DDD5]">
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left text-sm text-[#1C1C1C] tracking-[0.02em]"
              >
                <span>{item.question}</span>
                <span className="ml-4 text-[#8A8072] text-lg leading-none flex-shrink-0">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className="text-sm text-[#8A8072] leading-relaxed">{item.answer}</p>
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
