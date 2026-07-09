import Image from "next/image";
import Link from "next/link";

type Props = {
  image?: string;
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  meta?: string;
};

export default function CreatorBooking({
  image,
  headline = "Book a session",
  description,
  ctaLabel = "Book now",
  ctaUrl = "#",
  meta,
}: Props) {
  return (
    <section className="px-5 py-6 max-w-[600px] mx-auto w-full" style={{ fontFamily: "var(--creator-body-font)" }}>
      <div className="mx-0 rounded-3xl overflow-hidden bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)]">
        {image && (
          <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
            <Image src={image} alt={headline} fill className="object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-3 p-6">
          <h2
            className="text-xl font-semibold text-[var(--creator-on-surface)]"
            style={{ fontFamily: "var(--creator-display-font)" }}
          >
            {headline}
          </h2>
          {description && (
            <p className="text-sm text-[var(--creator-muted)] leading-relaxed">{description}</p>
          )}
          {meta && (
            <div className="flex items-center gap-4 text-xs text-[var(--creator-muted)]">
              {meta}
            </div>
          )}
          <Link
            href={ctaUrl}
            target={ctaUrl.startsWith("http") ? "_blank" : undefined}
            rel={ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="h-14 rounded-2xl bg-[var(--primary)] text-white text-base font-semibold flex items-center justify-center mt-1 hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
