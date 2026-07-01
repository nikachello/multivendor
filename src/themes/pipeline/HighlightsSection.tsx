import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], variant = "icons-row", themeConfig }: Props) => {
  if (!items.length) return null;

  // CARDS: full image cards with text overlay
  if (variant === "cards") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-4`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="relative overflow-hidden bg-neutral-50 group" style={{ aspectRatio: "4/5" }}>
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? ""}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-neutral-100" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-1.5">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-sm font-semibold tracking-wide text-white">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-white/70 mt-1.5 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // NUMBERED: large dim numbers
  if (variant === "numbered") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex flex-col py-10 md:py-0 md:px-12 first:pl-0 last:pr-0">
              <span className="text-[60px] font-bold tabular-nums leading-none text-neutral-100 mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-900">{item.title}</p>
              {item.description && (
                <p className="text-sm text-neutral-500 mt-2.5 leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ICONS-ROW (default): thin border top, 3-col horizontal feature row
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-100`}>
        {items.map((item: Highlight, i: number) => (
          <div key={i} className="flex flex-col py-8 md:py-0 md:px-12 first:pl-0 last:pr-0">
            <div className="w-full border-t-2 border-neutral-900 mb-8" />
            {item.imageUrl ? (
              <div className="relative w-5 h-5 mb-5 shrink-0">
                <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
              </div>
            ) : (
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-300 mb-5">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-900">{item.title}</p>
            {item.description && (
              <p className="text-sm text-neutral-500 mt-2.5 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
