import type { ThemeConfig } from "@/themes/types";
import type { StatsSectionProps } from "@/lib/types/sections";

type Props = StatsSectionProps & { themeConfig: ThemeConfig };

const StatsSection = ({ stats = [], themeConfig }: Props) => {
  if (!stats.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-4 gap-12`}>
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className={themeConfig.type.display}>{stat.value}</p>
            <p className={`mt-3 ${themeConfig.type.label}`}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
