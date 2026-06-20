import { HighlightsSectionProps } from "@/lib/types/sections";
import { Highlight } from "@/lib/types/data-types";

const HighlightsSection = ({ items = [] }: HighlightsSectionProps) => {
  if (!items.length) return null;

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E2DDD5]">
        {items.map((item: Highlight, i: number) => (
          <div key={i} className="px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8072] mb-4">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display text-xl font-light text-[#1C1C1C] leading-snug">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-3 text-sm text-[#8A8072] leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
