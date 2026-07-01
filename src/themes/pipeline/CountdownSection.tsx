"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
  endDate?: string;
  buttonText?: string;
  buttonUrl?: string;
  background?: "dark" | "light";
};

function getTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const CountdownSection = ({
  title = "Limited Time Offer",
  subtitle,
  endDate,
  buttonText,
  buttonUrl = "/",
  background = "dark",
}: Props) => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;
    setTime(getTimeLeft(endDate));
    const id = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const isDark = background === "dark";
  const bgClass = isDark ? "bg-neutral-900 text-white" : "bg-neutral-50 text-neutral-900";
  const labelClass = isDark ? "text-white/50" : "text-neutral-400";
  const dividerClass = isDark ? "border-white/10" : "border-neutral-200";

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="px-5 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div>
          {subtitle && (
            <p className={`text-[10px] font-semibold tracking-[0.22em] uppercase mb-3 ${labelClass}`}>
              {subtitle}
            </p>
          )}
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>

        {endDate && (
          <div className="flex items-end gap-6">
            {[
              { value: time.days, label: "Days" },
              { value: time.hours, label: "Hours" },
              { value: time.minutes, label: "Min" },
              { value: time.seconds, label: "Sec" },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-end gap-6">
                {i > 0 && <span className={`text-3xl font-thin mb-2 ${labelClass}`}>:</span>}
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-bold tabular-nums tracking-tighter">
                    {pad(value)}
                  </span>
                  <span className={`text-[9px] font-semibold tracking-[0.2em] uppercase mt-1 ${labelClass}`}>
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {buttonText && (
          <Link
            href={buttonUrl}
            className={`shrink-0 inline-block border text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 transition-colors ${
              isDark
                ? "border-white text-white hover:bg-white hover:text-neutral-900"
                : "border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            {buttonText}
          </Link>
        )}
      </div>

      <div className={`mx-5 md:mx-12 mt-10 border-t ${dividerClass}`} />
    </section>
  );
};

export default CountdownSection;
