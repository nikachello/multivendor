"use client";

import { useState } from "react";
import type { ThemeConfig } from "@/themes/types";
import type { NewsletterSectionProps } from "@/lib/types/sections";

type Props = NewsletterSectionProps & { themeConfig: ThemeConfig };

const NewsletterSection = ({
  title = "Stay in the know",
  subtitle,
  buttonText = "Subscribe",
  variant = "banner",
  themeConfig,
}: Props) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  const isMinimal = variant === "minimal";

  const wrapperCls = isMinimal
    ? `${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx} bg-[var(--page-bg)]`
    : themeConfig.sections.newsletter.wrapper;

  const inputCls = isMinimal
    ? `flex-1 ${themeConfig.components.input}`
    : `flex-1 ${themeConfig.components.input}`;

  const inputStyle = isMinimal ? undefined : themeConfig.sections.newsletter.inputStyle;

  const buttonStyle = isMinimal
    ? { backgroundColor: "var(--primary)", color: "var(--secondary)", ...themeConfig.components.button.style }
    : themeConfig.sections.newsletter.buttonStyle;

  const headingStyle = isMinimal ? undefined : { color: "var(--secondary)" };
  const subtitleStyle = isMinimal ? undefined : { color: "var(--secondary)" };

  return (
    <section className={wrapperCls}>
      <div className={`${themeConfig.layout.contentPx} max-w-2xl mx-auto text-center`}>
        <h2
          className={themeConfig.type.sectionHeading}
          style={headingStyle}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-4 ${themeConfig.type.body} opacity-70`}
            style={subtitleStyle}
          >
            {subtitle}
          </p>
        )}
        {submitted ? (
          <p className={`mt-10 ${themeConfig.type.label}`}>
            Thank you for subscribing.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={inputCls}
              style={inputStyle}
            />
            <button
              type="submit"
              className="text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 transition-colors whitespace-nowrap"
              style={buttonStyle}
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
