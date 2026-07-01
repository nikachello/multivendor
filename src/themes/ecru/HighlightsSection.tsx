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
            <div key={i} className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-14 items-start">
              <span
                className="font-bodoni font-medium text-[var(--accent)] leading-none"
                style={{ fontSize: "clamp(80px, 12vw, 140px)", lineHeight: 0.88 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-3">
                <h3 className="text-[13px] tracking-[0.16em] uppercase text-[#1B1714] mb-3">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-[15px] text-[var(--muted)] leading-[1.65] max-w-prose">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "cards") {
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
              <div
                className="font-bodoni font-medium text-[var(--accent)] leading-none mb-5"
                style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-[13px] tracking-[0.16em] uppercase text-[#1B1714] mb-3">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-[15px] text-[var(--muted)] leading-[1.65]">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // icons-row (default ecru style)
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3`}>
        {items.map((item: Highlight, i: number) => (
          <div
            key={i}
            style={{
              padding: `8px clamp(26px, 2.5vw, 40px)`,
              paddingLeft: i === 0 ? "0" : undefined,
              paddingRight: i === items.length - 1 ? "0" : undefined,
              borderLeft: i > 0 ? "1px solid var(--subtle)" : undefined,
            }}
          >
            {item.imageUrl && (
              <div className="relative w-10 h-10 mb-5 shrink-0">
                <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain" unoptimized />
              </div>
            )}
            <div
              className="font-bodoni font-medium text-[var(--accent)] leading-none mb-5"
              style={{ fontSize: "clamp(42px, 5vw, 72px)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-[13px] tracking-[0.16em] uppercase text-[#1B1714] mb-3">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[15px] text-[var(--muted)] leading-[1.65]">
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
