"use client";

import { useState } from "react";
import { FaqSectionProps } from "@/lib/types/sections";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-neutral-900">{question}</span>
        <svg
          className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-4 text-sm text-neutral-500 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function FaqSection({ title, items = [] }: FaqSectionProps) {
  return (
    <section className="py-14">
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-8 text-center">
          {title}
        </h2>
      )}
      {items.length === 0 ? (
        <p className="text-center text-sm text-neutral-400">No questions added yet.</p>
      ) : (
        <div className="max-w-2xl mx-auto border-t border-neutral-200">
          {items.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      )}
    </section>
  );
}
