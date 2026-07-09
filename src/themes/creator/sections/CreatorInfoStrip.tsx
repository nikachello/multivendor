type InfoItem = { id: string; icon: string; text: string };

type Props = {
  items?: InfoItem[];
};

export default function CreatorInfoStrip({ items = [] }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="px-5 py-4 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-xl bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] px-3 py-2.5"
          >
            <span className="text-base shrink-0" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-xs font-medium text-[var(--creator-on-surface)] leading-tight">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
