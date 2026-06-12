"use client";

import { useState } from "react";
import { NewsletterSectionProps } from "@/lib/types/sections";

export default function NewsletterSection({
  title = "Stay in the loop",
  subtitle,
  buttonText = "Subscribe",
  variant = "banner",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (variant === "minimal") {
    return (
      <section className="py-14">
        <div className="max-w-md">
          {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
          {submitted ? (
            <p className="mt-4 text-sm text-neutral-600">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition-colors"
              >
                {buttonText}
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  // banner (default)
  return (
    <section className="bg-neutral-900 text-white py-20 px-5">
      <div className="max-w-xl mx-auto text-center">
        {title && (
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-3 text-sm text-white/70">{subtitle}</p>
        )}
        {submitted ? (
          <p className="mt-8 text-sm text-white/80">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex gap-0 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
            >
              {buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
