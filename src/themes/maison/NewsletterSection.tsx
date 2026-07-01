"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { NewsletterSectionProps } from "@/lib/types/sections";

type Props = NewsletterSectionProps & { themeConfig: ThemeConfig };

const NewsletterSection = ({
  title = "Stay in touch",
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
      className={`${themeConfig.layout.sectionPy}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className={`${themeConfig.layout.contentPx} max-w-lg mx-auto text-center`}>
        {submitted ? (
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--muted)]">
            Thank you for subscribing.
          </p>
        ) : (
          <>
            {title && (
              <h2 className={`${themeConfig.type.displayFont} text-3xl font-light text-[var(--primary)] mb-3`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[11px] tracking-[0.08em] text-[var(--muted)] mb-10">{subtitle}</p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-[var(--subtle)] pb-3 text-sm text-[var(--primary)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)] transition-colors text-center"
              />
              <button
                type="submit"
                className="mt-2 border border-[var(--primary)] text-[var(--primary)] text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
                style={{ borderRadius: "var(--radius)" }}
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
