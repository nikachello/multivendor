import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], variant = "numbered", themeConfig }: Props) => {
  if (!items.length) return null;

  // CARDS: bordered cards with parchment bg
  if (variant === "cards") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--subtle)]`}>
          {items.map((item: Highlight, i: number) => (
            <div
              key={i}
              className="bg-[var(--surface)] p-10 flex flex-col"
            >
              <p className={`text-[11px] tracking-[0.18em] uppercase text-[var(--muted)] mb-6`}>
                {String(i + 1).padStart(2, "0")}
              </p>
              {item.imageUrl && (
                <div className="relative w-8 h-8 mb-6">
                  <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
                </div>
              )}
              <h3 className={`${themeConfig.type.displayFont} text-lg font-light text-[var(--primary)] leading-snug`}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-3 text-sm text-[var(--muted)] leading-[1.9]">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ICONS-ROW: thin vertical dividers
  if (variant === "icons-row") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--subtle)]`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex flex-col py-10 md:py-0 md:px-12 first:pl-0 last:pr-0">
              {item.imageUrl ? (
                <div className="relative w-8 h-8 mb-6">
                  <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <p className={`text-[11px] tracking-[0.18em] uppercase text-[var(--muted)] mb-6`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
              )}
              <h3 className={`${themeConfig.type.displayFont} text-lg font-light text-[var(--primary)]`}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-3 text-sm text-[var(--muted)] leading-[1.9]">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // NUMBERED (default): large serif counter, dimmed muted color, title below in uppercase tracking
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} flex flex-col gap-20`}>
        {items.map((item: Highlight, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-16 items-start"
          >
            <span
              className={`${themeConfig.type.displayFont} text-[var(--subtle)] leading-none select-none`}
              style={{ fontSize: "clamp(80px, 10vw, 120px)", lineHeight: 0.85 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pt-2">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)] mb-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={`${themeConfig.type.displayFont} text-2xl font-light text-[var(--primary)] leading-snug`}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-4 text-sm text-[var(--muted)] leading-[1.9] max-w-prose">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
