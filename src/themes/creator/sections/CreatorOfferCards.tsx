import Link from "next/link";
import Image from "next/image";

type OfferItem = {
  id: string;
  image?: string;
  icon?: string;
  title: string;
  description?: string;
  price: string;
  ctaLabel?: string;
  ctaUrl: string;
};

type Props = {
  title?: string;
  items?: OfferItem[];
};

export default function CreatorOfferCards({ title, items = [] }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--creator-muted)] mb-4">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl bg-[var(--creator-surface)] p-5 ring-1 ring-[var(--creator-subtle)]"
          >
            {/* Icon or image */}
            {item.image ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[var(--creator-subtle)]">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
            ) : item.icon ? (
              <div className="w-11 h-11 rounded-xl bg-[var(--creator-subtle)] flex items-center justify-center text-lg">
                {item.icon}
              </div>
            ) : null}

            <h3 className="text-base font-semibold text-[var(--creator-on-surface)]">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-[var(--creator-muted)] leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="text-lg font-bold text-[var(--creator-on-surface)] mt-1">
              {item.price}
            </p>
            <Link
              href={item.ctaUrl}
              target={item.ctaUrl.startsWith("http") ? "_blank" : undefined}
              rel={item.ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="h-11 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {item.ctaLabel ?? "Get access"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
