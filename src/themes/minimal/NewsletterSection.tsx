"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { NewsletterSectionProps } from "@/lib/types/sections";

type Props = NewsletterSectionProps & { themeConfig: ThemeConfig };

const NewsletterSection = ({
  title = "Subscribe",
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
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {submitted ? (
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Thanks for subscribing.
          </p>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="md:w-64 shrink-0">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                Newsletter
              </p>
              {title && (
                <p className="text-sm font-medium text-neutral-900">{title}</p>
              )}
              {subtitle && (
                <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-1 gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-neutral-200 border-r-0 px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300 bg-transparent"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white text-xs font-medium tracking-wide uppercase px-6 py-2.5 hover:opacity-80 transition-opacity shrink-0"
              >
                {buttonText}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
