import type { ThemeConfig } from "@/themes/types";
import type { StatsSectionProps } from "@/lib/types/sections";

type Props = StatsSectionProps & { themeConfig: ThemeConfig };

const StatsSection = ({ stats = [], themeConfig }: Props) => {
  if (!stats.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--surface)] shadow-sm flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{ borderRadius: "var(--radius)" }}
            >
              <p
                className={`text-4xl font-bold tabular-nums leading-none`}
                style={{ color: "var(--accent)" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-[var(--muted)] mt-2 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
