import { Fragment } from "react";
import Image from "next/image";

type Stat = { value: string; label: string };
type Logo = { url: string; alt: string };

type Props = {
  stats?: Stat[];
  logos?: Logo[];
};

export default function CreatorSocialProofBar({ stats = [], logos = [] }: Props) {
  if (stats.length === 0 && logos.length === 0) return null;

  return (
    <section
      className="px-5 py-6 flex flex-col gap-5 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {stats.length > 0 && (
        <div className="flex items-stretch justify-between gap-2 rounded-2xl bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] px-4 py-4">
          {stats.map((stat, i) => (
            <Fragment key={stat.label}>
              {i > 0 && (
                <div className="w-px bg-[var(--creator-subtle)] self-stretch" />
              )}
              <div className="flex flex-col items-center gap-0.5 flex-1 text-center">
                <span className="text-lg font-bold text-[var(--creator-on-surface)] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-[11px] text-[var(--creator-muted)]">{stat.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      )}

      {logos.length > 0 && (
        <div className="flex items-center justify-center gap-6 opacity-60 grayscale flex-wrap">
          {logos.map((logo) => (
            <div key={logo.alt} className="relative h-6 w-16">
              <Image src={logo.url} alt={logo.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
