import { StatsSectionProps } from "@/lib/types/sections";

const StatsSection = ({ stats = [] }: StatsSectionProps) => {
  if (!stats.length) return null;
  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="font-display text-5xl md:text-6xl font-light text-[#1C1C1C] leading-none">
              {stat.value}
            </p>
            <p className="mt-3 text-xs tracking-[0.15em] uppercase text-[#8A8072]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
