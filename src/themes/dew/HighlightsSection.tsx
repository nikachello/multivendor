import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";
import type { HighlightsSectionProps } from "@/lib/types/sections";
import type { Highlight } from "@/lib/types/data-types";

type Props = HighlightsSectionProps & { themeConfig: ThemeConfig };

const HighlightsSection = ({ items = [], variant = "cards", themeConfig }: Props) => {
  if (!items.length) return null;

  // NUMBERED: rounded counter badges in accent color
  if (variant === "numbered") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-6`}>
          {items.map((item: Highlight, i: number) => (
            <div
              key={i}
              className="bg-[var(--surface)] shadow-sm p-6 flex flex-col gap-4"
              style={{ borderRadius: "var(--radius)" }}
            >
              <span
                className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold text-white shrink-0 self-start"
                style={{ backgroundColor: "var(--accent)", borderRadius: "999px" }}
              >
                {i + 1}
              </span>
              <h3 className="text-sm font-semibold text-[var(--primary)]">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ICONS-ROW: soft rounded cards but in a horizontal 3-col grid
  if (variant === "icons-row") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-6`}>
          {items.map((item: Highlight, i: number) => (
            <div
              key={i}
              className="bg-[var(--surface)] shadow-sm p-6 flex flex-col gap-4"
              style={{ borderRadius: "var(--radius)" }}
            >
              {item.imageUrl ? (
                <div
                  className="relative w-10 h-10 shrink-0 overflow-hidden"
                  style={{ borderRadius: "999px", backgroundColor: "var(--accent)" }}
                >
                  <Image src={item.imageUrl} alt={item.title ?? ""} fill className="object-contain p-2" />
                </div>
              ) : (
                <div
                  className="w-10 h-10 shrink-0"
                  style={{ borderRadius: "999px", backgroundColor: "var(--accent)", opacity: 0.15 }}
                />
              )}
              <h3 className="text-sm font-semibold text-[var(--primary)]">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // CARDS (default): soft rounded cards with accent color background dot for icon
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-6`}>
        {items.map((item: Highlight, i: number) => (
          <div
            key={i}
            className="bg-[var(--surface)] shadow-sm p-6 flex flex-col gap-4"
            style={{ borderRadius: "var(--radius)" }}
          >
            {item.imageUrl ? (
              <div
                className="relative w-12 h-12 shrink-0"
                style={{ borderRadius: "var(--radius)", backgroundColor: "var(--accent)", opacity: 0.12 }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title ?? ""}
                  fill
                  className="object-contain p-3"
                  style={{ opacity: 1 / 0.12 }}
                />
              </div>
            ) : (
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: "var(--accent)" }}
              />
            )}
            <h3 className="text-sm font-semibold text-[var(--primary)]">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-[var(--muted)] leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
