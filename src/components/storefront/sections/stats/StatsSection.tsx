import { StatsSectionProps } from "@/lib/types/sections";

export default function StatsSection({ stats = [] }: StatsSectionProps) {
  if (stats.length === 0) {
    return (
      <section className="py-14">
        <p className="text-center text-sm text-neutral-400">No stats added yet.</p>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-neutral-100">
        {stats.map((stat, i) => (
          <div key={i} className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
