import type { ThemeConfig } from "@/themes/types";
import type { StatsSectionProps } from "@/lib/types/sections";

type Props = StatsSectionProps & { themeConfig: ThemeConfig };

const StatsSection = ({ stats = [], themeConfig }: Props) => {
  if (!stats.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-10 md:py-0 md:px-8 first:pl-0 last:pr-0"
            >
              <p className="text-4xl font-semibold tabular-nums text-neutral-900 leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-2">
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
