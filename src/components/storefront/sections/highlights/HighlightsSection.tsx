import { HighlightsSectionProps } from "@/lib/types/sections";
import { Highlight } from "@/lib/types/data-types";
import HighlightItem from "./HighlightItem";

const HighlightsSection = ({ items = [], variant = "cards" }: HighlightsSectionProps) => {
  if (variant === "icons-row") {
    return (
      <section className="py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex flex-col items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-neutral-500 text-lg font-medium">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "numbered") {
    return (
      <section className="py-14">
        <div className="flex flex-col gap-10">
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="grid md:grid-cols-[80px_1fr] gap-4 items-start">
              <span className="text-5xl font-bold text-neutral-100 leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // cards (default)
  return (
    <section>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pt-20">
        {items.map((item: Highlight, i: number) => (
          <HighlightItem key={i} item={item} />
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
