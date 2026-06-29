import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], themeConfig }: Props) => {
  if (!items.length) return null;

  if (themeConfig.sections.highlights.variant === "cards") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-4`}>
          {items.map((item: Highlight, i: number) => (
            <div
              key={i}
              className="p-8 bg-[var(--surface)]"
              style={{ borderRadius: "var(--radius)" }}
            >
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
  }

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div
        className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--subtle)]`}
      >
        {items.map((item: Highlight, i: number) => (
          <div key={i} className="px-0 md:px-10 py-8 md:py-0 first:pl-0 last:pr-0">
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
