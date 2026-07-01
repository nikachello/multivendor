import type { ThemeConfig } from "@/themes/types";
import type { StatsSectionProps } from "@/lib/types/sections";

type Props = StatsSectionProps & { themeConfig: ThemeConfig };

const StatsSection = ({ stats = [], themeConfig }: Props) => {
  if (!stats.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100`}>
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center py-10 md:py-6 text-center first:pt-0 md:first:pt-6">
            <span className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900">
              {stat.value}
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mt-2">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
