import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], variant = "icons-row", themeConfig }: Props) => {
  if (!items.length) return null;

  // CARDS variant: clean numbered list, very spare
  if (variant === "cards") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} space-y-0`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex items-start gap-8 py-8 border-t border-neutral-100 last:border-b">
              <span className="text-xs font-semibold tabular-nums text-neutral-300 pt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-widest text-neutral-900">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // NUMBERED variant: same as icons-row but with large dim counter
  if (variant === "numbered") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex flex-col pt-8 md:pt-0 md:px-10 first:pl-0 last:pr-0 pb-8 md:pb-0">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-neutral-300 mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold uppercase tracking-widest text-neutral-900">{item.title}</p>
              {item.description && (
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ICONS-ROW (default): thin top border, small icon or number, 3-col horizontal
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-100`}>
        {items.map((item: Highlight, i: number) => (
          <div key={i} className="flex flex-col pt-6 md:pt-0 md:px-10 first:pl-0 last:pr-0 pb-6 md:pb-0">
            <div className="w-full border-t border-neutral-900 mb-6" />
            {item.imageUrl ? (
              <div className="relative w-6 h-6 mb-5 shrink-0">
                <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
              </div>
            ) : (
              <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-300 mb-5">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-900">{item.title}</p>
            {item.description && (
              <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
