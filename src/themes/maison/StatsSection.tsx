import type { ThemeConfig } from "@/themes/types";
import type { StatsSectionProps } from "@/lib/types/sections";

type Props = StatsSectionProps & { themeConfig: ThemeConfig };

const StatsSection = ({ stats = [], themeConfig }: Props) => {
  if (!stats.length) return null;

  return (
    <section
      className={`${themeConfig.layout.sectionPy}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--subtle)]">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-12 md:py-0 md:px-10 first:pl-0 last:pr-0 text-center"
            >
              <p
                className={`${themeConfig.type.display} ${themeConfig.type.displayFont} text-[var(--primary)] leading-none`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] mt-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
