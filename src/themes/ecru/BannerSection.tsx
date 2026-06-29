"use client";

import Image from "next/image";
import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, shopSlug: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return `/shop/${shopSlug}`;
  return `/shop/${shopSlug}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string };

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
  variant = "cover",
}: Props) => {

  if (variant === "compact") {
    return (
      <section className="py-16 md:py-20 xl:py-24 px-6 text-center bg-[var(--surface)] border-t border-b border-[var(--subtle)]">
        {subtitle && (
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--accent)] mb-5">
            {subtitle}
          </p>
        )}
        {title && (
          <h2
            className="font-bodoni font-medium leading-[1.04] tracking-[-0.01em] text-[#1B1714] mx-auto"
            style={{ fontSize: "clamp(30px, 4.5vw, 56px)", maxWidth: "14ch" }}
          >
            {title}
          </h2>
        )}
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-[var(--subtle)]">
        <div className="relative bg-[var(--subtle)]" style={{ minHeight: "clamp(380px, 46vw, 560px)" }}>
          {image ? (
            <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full bg-[var(--surface)]" />
          )}
        </div>
        <div
          className="flex flex-col justify-center bg-[var(--page-bg)]"
          style={{ padding: "clamp(44px, 6vw, 84px)" }}
        >
          {subtitle && (
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--accent)] mb-5">
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="font-bodoni font-medium leading-[1.04] tracking-[-0.01em] text-[#1B1714] mb-8"
              style={{ fontSize: "clamp(30px, 3.6vw, 50px)" }}
            >
              {title}
            </h2>
          )}
          {buttonText && (
            <Link
              href={resolveHref(href, shopSlug)}
              className="self-start text-[12px] tracking-[0.18em] uppercase text-[#1B1714] border-b border-[#1B1714] pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  // cover (default)
  return (
    <section
      className="relative overflow-hidden flex items-end bg-[#1B1714]"
      style={{ minHeight: "clamp(460px, 74vh, 780px)" }}
    >
      {image && (
        <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized priority />
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(20,17,14,.66), rgba(20,17,14,.04) 56%, rgba(20,17,14,.18))" }}
      />
      <div
        className="relative z-10 pb-10 md:pb-16"
        style={{ padding: "0 clamp(22px, 6vw, 80px) clamp(40px, 5vw, 72px)", maxWidth: "680px" }}
      >
        {subtitle && (
          <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--accent)] mb-5">
            {subtitle}
          </p>
        )}
        {title && (
          <h1
            className="font-bodoni font-medium leading-none tracking-[-0.01em] text-[#EFE8DA] mb-6"
            style={{ fontSize: "clamp(44px, 7vw, 86px)" }}
          >
            {title}
          </h1>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, shopSlug)}
            className="inline-block text-[#EFE8DA] text-[12px] tracking-[0.2em] uppercase px-8 py-4 transition-colors hover:bg-[#EFE8DA] hover:text-[#1B1714]"
            style={{ backgroundColor: "var(--accent)", borderRadius: "var(--radius)" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
