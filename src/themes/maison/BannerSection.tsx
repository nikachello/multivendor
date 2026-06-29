"use client";
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
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${transparent ? "-mt-[88px]" : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
