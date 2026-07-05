"use client";

import Image from "next/image";
import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string; shopBase?: string; transparent?: boolean };

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
  shopBase,
  transparent = false,
  variant = "cover",
  imagePosition = "center",
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  if (variant === "split") {
    return (
      <section className="grid md:grid-cols-2 border-t border-b border-[var(--subtle)]">
        <div className="relative bg-[var(--surface)]" style={{ minHeight: "clamp(360px, 46vw, 580px)" }}>
          {image && (
            <Image src={image} alt={title} fill className="object-cover" style={{ objectPosition: imagePosition }} />
          )}
        </div>
        <div className="flex flex-col justify-center bg-[var(--page-bg)]" style={{ padding: "clamp(48px, 7vw, 96px)" }}>
          {subtitle && (
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--muted)] mb-5">{subtitle}</p>
          )}
          <h2 className="font-display text-3xl md:text-5xl font-light text-[#1f1b16] leading-tight tracking-wide">
            {title}
          </h2>
          {buttonText && (
            <Link
              href={resolveHref(href, base)}
              className="mt-10 self-start border border-[var(--primary)] text-[var(--primary)] text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <section
        className={`relative h-72 overflow-hidden flex items-center ${transparent ? "-mt-[88px]" : ""}`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: imagePosition,
          backgroundColor: image ? undefined : "var(--primary)",
        }}
      >
        {image && <div className="absolute inset-0 bg-black/40" />}
        <div className="relative z-10 px-10 md:px-16">
          <h2 className={`font-display text-3xl md:text-4xl font-light leading-tight tracking-wide ${image ? "text-white" : "text-[var(--secondary)]"}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-3 text-sm tracking-[0.06em] ${image ? "text-white/65" : "text-[var(--secondary)]/70"}`}>{subtitle}</p>
          )}
        </div>
      </section>
    );
  }

  // cover (default) — full-screen centred editorial style
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${transparent ? "-mt-[88px]" : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: imagePosition,
        backgroundColor: image ? undefined : "var(--primary)",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-white leading-tight tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-sm md:text-base text-white/65 tracking-[0.08em] max-w-md leading-relaxed">
            {subtitle}
          </p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-10 inline-block border border-white/50 text-white text-[11px] tracking-[0.25em] uppercase px-10 py-4 hover:bg-white hover:text-[#1C1C1C] transition-colors duration-200"
            style={{ borderRadius: "var(--radius)" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
