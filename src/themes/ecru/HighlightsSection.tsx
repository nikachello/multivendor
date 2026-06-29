import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], themeConfig }: Props) => {
  if (!items.length) return null;

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
