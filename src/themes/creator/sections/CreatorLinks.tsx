import Link from "next/link";

type LinkItem = {
  id: string;
  label: string;
  url: string;
  emoji?: string;
  style?: "filled" | "outline" | "ghost";
  disabled?: boolean;
};

type Props = {
  items?: LinkItem[];
  shopBase?: string;
};

function resolveUrl(url: string, base: string): string {
  if (!url || url === "#") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${base}${url}`;
}

const VARIANT_CLASSES: Record<string, string> = {
  filled:
    "bg-[var(--creator-link-btn-bg)] text-[var(--creator-on-surface)] shadow-sm ring-1 ring-black/[0.03] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
  outline:
    "bg-transparent text-[var(--creator-on-surface)] ring-1 ring-[var(--creator-subtle)] hover:bg-[var(--creator-surface)] active:scale-[0.99]",
  ghost:
    "bg-transparent text-[var(--primary)] hover:bg-[var(--creator-subtle)]/50",
};

export default function CreatorLinks({ items = [], shopBase = "" }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="flex flex-col gap-3 px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {items.map((item) => {
        const variantClass = VARIANT_CLASSES[item.style ?? "filled"];
        const disabledClass = item.disabled
          ? "opacity-40 pointer-events-none grayscale"
          : "";

        return (
          <Link
            key={item.id}
            href={resolveUrl(item.url, shopBase)}
            target={item.url.startsWith("http") ? "_blank" : undefined}
            rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`flex items-center justify-center gap-2 h-14 rounded-2xl text-[15px] font-semibold transition-all ${variantClass} ${disabledClass}`}
            aria-disabled={item.disabled}
          >
            {item.emoji && (
              <span className="text-lg leading-none" aria-hidden="true">
                {item.emoji}
              </span>
            )}
            {item.label}
          </Link>
        );
      })}
    </section>
  );
}
