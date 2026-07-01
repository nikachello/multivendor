"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { NewsletterSectionProps } from "@/lib/types/sections";

type Props = NewsletterSectionProps & { themeConfig: ThemeConfig };

const NewsletterSection = ({
  title = "Stay in the loop",
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
    <section className={themeConfig.sections.newsletter.wrapper}>
      <div className="max-w-2xl mx-auto text-center">
        {submitted ? (
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60">
            You&rsquo;re subscribed — thank you.
          </p>
        ) : (
          <>
            {title && (
              <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-white mb-3">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-white/60 mb-8">{subtitle}</p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-5 py-4 text-sm outline-none placeholder:text-white/30"
                style={themeConfig.sections.newsletter.inputStyle}
              />
              <button
                type="submit"
                className="px-8 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-80 shrink-0"
                style={themeConfig.sections.newsletter.buttonStyle}
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
