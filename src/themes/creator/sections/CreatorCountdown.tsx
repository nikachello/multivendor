"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  dropName?: string;
  targetDate?: string;
  notifyLabel?: string;
  liveCtaLabel?: string;
  liveCtaUrl?: string;
  shopBase?: string;
};

function resolveUrl(url: string, base: string): string {
  if (!url || url === "#") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${base}${url}`;
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CreatorCountdown({
  dropName = "Upcoming drop",
  targetDate = "",
  notifyLabel = "Notify me",
  liveCtaLabel = "Shop now",
  liveCtaUrl = "#",
  shopBase = "",
}: Props) {
  const [timeLeft, setTimeLeft] = useState(targetDate ? getTimeLeft(targetDate) : null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isLive = targetDate && timeLeft === null;

  return (
    <section
      className="mx-auto my-6 rounded-3xl px-6 py-8 text-center text-white max-w-[560px] w-[calc(100%-40px)]"
      style={{ backgroundColor: "var(--primary)", fontFamily: "var(--creator-body-font)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
        {isLive ? "Now live" : "Dropping in"}
      </p>
      <p
        className="text-xl font-semibold mt-1 mb-5"
        style={{ fontFamily: "var(--creator-display-font)" }}
      >
        {dropName}
      </p>

      {isLive ? (
        /* Live state */
        <Link
          href={resolveUrl(liveCtaUrl, shopBase)}
          className="mt-2 h-12 w-full rounded-xl bg-white font-semibold text-sm flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          {liveCtaLabel} →
        </Link>
      ) : timeLeft ? (
        /* Countdown state */
        <>
          <div className="flex items-center justify-center gap-3">
            {[
              { v: timeLeft.days, u: "days" },
              { v: timeLeft.hours, u: "hrs" },
              { v: timeLeft.minutes, u: "min" },
              { v: timeLeft.seconds, u: "sec" },
            ].map(({ v, u }) => (
              <div
                key={u}
                className="flex flex-col items-center gap-1 min-w-[52px] rounded-xl py-2"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <span className="text-2xl font-bold tabular-nums">{pad(v)}</span>
                <span className="text-[10px] uppercase tracking-wide opacity-70">{u}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-12 rounded-xl px-4 text-sm outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
              }}
            />
            <button
              onClick={() => setEmail("")}
              className="h-12 rounded-xl px-4 text-sm font-semibold bg-white hover:opacity-90 transition-opacity"
              style={{ color: "var(--primary)" }}
            >
              {notifyLabel}
            </button>
          </div>
        </>
      ) : (
        /* No date set — placeholder */
        <p className="opacity-60 text-sm">Date not set</p>
      )}
    </section>
  );
}
