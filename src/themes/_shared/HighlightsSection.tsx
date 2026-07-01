import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], variant = "cards", themeConfig }: Props) => {
  if (!items.length) return null;

  if (variant === "numbered") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} flex flex-col gap-16`}>
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
              <span
                className="font-display leading-none text-[var(--subtle)]"
                style={{ fontSize: "clamp(72px, 10vw, 120px)", lineHeight: 0.9 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-2">
                <h3 className={themeConfig.type.sectionHeading}>{item.title}</h3>
                {item.description && (
                  <p className={`mt-3 max-w-prose ${themeConfig.type.body}`}>{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "icons-row") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div
          className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--subtle)]`}
        >
          {items.map((item: Highlight, i: number) => (
            <div key={i} className="flex flex-col items-start px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0">
              {item.imageUrl && (
                <div className="relative w-10 h-10 mb-4 shrink-0">
                  <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
                </div>
              )}
              <h3 className={themeConfig.type.sectionHeading}>{item.title}</h3>
              {item.description && (
                <p className={`mt-3 ${themeConfig.type.body}`}>{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // cards (default)
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-4`}>
        {items.map((item: Highlight, i: number) => (
          <div
            key={i}
            className="p-8 bg-[var(--surface)]"
            style={{ borderRadius: "var(--radius)" }}
          >
            {item.imageUrl && (
              <div className="relative w-10 h-10 mb-5 shrink-0">
                <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
              </div>
            )}
            <p className={`${themeConfig.type.label} mb-4`}>
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className={themeConfig.type.sectionHeading}>{item.title}</h3>
            {item.description && (
              <p className={`mt-3 ${themeConfig.type.body}`}>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
