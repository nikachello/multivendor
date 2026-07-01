"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { NewsletterSectionProps } from "@/lib/types/sections";

type Props = NewsletterSectionProps & { themeConfig: ThemeConfig };

const NewsletterSection = ({
  title = "Stay in the glow",
  subtitle,
  buttonText = "Subscribe",
  themeConfig,
}: Props) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section
      className={`${themeConfig.layout.sectionPy} bg-[var(--surface)]`}
    >
      <div className={`${themeConfig.layout.contentPx} max-w-lg mx-auto text-center`}>
        {/* Accent dot decoration */}
        <div
          className="w-3 h-3 rounded-full mx-auto mb-6"
          style={{ backgroundColor: "var(--accent)" }}
        />
        {submitted ? (
          <p className="text-sm font-medium text-[var(--primary)]">
            You&apos;re on the list — welcome!
          </p>
        ) : (
          <>
            {title && (
              <h2 className={`${themeConfig.type.sectionHeading} text-2xl mb-2`}>{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-[var(--muted)] mb-8">{subtitle}</p>
            )}
            {!subtitle && <div className="mb-8" />}
            <form onSubmit={handleSubmit} className="flex gap-0 items-stretch">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white text-sm text-[var(--primary)] px-5 py-3.5 outline-none placeholder:text-[var(--muted)] min-w-0"
                style={{ borderRadius: "var(--radius) 0 0 var(--radius)" }}
              />
              <button
                type="submit"
                className="bg-[var(--accent)] text-white text-sm font-semibold px-6 py-3.5 hover:opacity-90 transition-opacity shrink-0"
                style={{ borderRadius: "0 var(--radius) var(--radius) 0" }}
              >
                {buttonText}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
