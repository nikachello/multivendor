"use client";

import { useState } from "react";

type Props = {
  headline?: string;
  total?: number;
  remaining?: number;
  ctaLabel?: string;
  ctaUrl?: string;
  waitlistEnabled?: boolean;
  waitlistCtaLabel?: string;
};

export default function CreatorAvailability({
  headline = "Limited availability",
  total,
  remaining,
  ctaLabel = "Book now",
  ctaUrl = "#",
  waitlistEnabled = false,
  waitlistCtaLabel = "Join waitlist",
}: Props) {
  const [email, setEmail] = useState("");

  const hasPct = typeof total === "number" && typeof remaining === "number" && total > 0;
  const pct = hasPct ? Math.round((remaining! / total!) * 100) : null;
  const isSoldOut = hasPct && remaining === 0;
  const isLow = hasPct && pct! < 30;

  const progressColor = isSoldOut
    ? "var(--creator-subtle)"
    : isLow
    ? "#F0C4B4"
    : "var(--primary)";

  return (
    <section
      className="mx-auto my-6 max-w-[560px] w-[calc(100%-40px)]"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      <div className="rounded-3xl bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] p-6 flex flex-col gap-4">
        <h2
          className="text-lg font-semibold text-[var(--creator-on-surface)]"
          style={{ fontFamily: "var(--creator-display-font)" }}
        >
          {headline}
        </h2>

        {hasPct && (
          <div className="flex flex-col gap-1.5">
            <div className="h-2 rounded-full bg-[var(--creator-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: progressColor }}
              />
            </div>
            <p
              className="text-xs"
              style={{ color: isLow && !isSoldOut ? "#7A2E12" : "var(--creator-muted)" }}
            >
              {isSoldOut
                ? "Fully booked"
                : `${remaining} of ${total} spots remaining`}
            </p>
          </div>
        )}

        {waitlistEnabled || isSoldOut ? (
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-12 rounded-xl bg-[var(--page-bg)] ring-1 ring-[var(--creator-subtle)] px-4 text-sm outline-none focus:ring-[var(--primary)]"
            />
            <button
              onClick={() => setEmail("")}
              className="h-12 rounded-xl px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {waitlistCtaLabel}
            </button>
          </div>
        ) : (
          <a
            href={ctaUrl}
            className="h-12 rounded-xl text-white text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40"
            style={{
              backgroundColor: isSoldOut ? "var(--creator-subtle)" : "var(--primary)",
              pointerEvents: isSoldOut ? "none" : "auto",
            }}
            aria-disabled={isSoldOut}
          >
            {isSoldOut ? "Sold out" : ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
