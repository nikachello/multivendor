"use client";

import { useState } from "react";
import { NewsletterSectionProps } from "@/lib/types/sections";

const NewsletterSection = ({
  title = "Stay in the know",
  subtitle,
  buttonText = "Subscribe",
}: NewsletterSectionProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="py-20 bg-[var(--primary)]">
      <div className="px-5 md:px-10 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-light leading-tight" style={{ color: "var(--secondary)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-sm tracking-[0.05em] leading-relaxed opacity-55" style={{ color: "var(--secondary)" }}>
            {subtitle}
          </p>
        )}

        {submitted ? (
          <p className="mt-10 text-[11px] tracking-[0.18em] uppercase text-[#8A8072]">
            Thank you for subscribing.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-transparent border px-5 py-3.5 text-sm outline-none transition-colors opacity-80 focus:opacity-100"
              style={{ borderColor: "var(--secondary)", color: "var(--secondary)" }}
            />
            <button
              type="submit"
              className="text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 transition-colors whitespace-nowrap"
              style={{ backgroundColor: "var(--secondary)", color: "var(--primary)", borderRadius: "var(--radius)" }}
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
