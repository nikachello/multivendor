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
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  if (variant === "split") {
    return (
      <section className="grid md:grid-cols-2">
        <div className="relative bg-neutral-900" style={{ minHeight: "clamp(340px, 46vw, 560px)" }}>
          {image && (
            <Image src={image} alt={title} fill className="object-cover" unoptimized />
          )}
          {image && <div className="absolute inset-0 bg-black/20" />}
        </div>
        <div
          className="flex flex-col justify-center px-10 py-16 md:px-16"
          style={{ backgroundColor: "#1c1916" }}
        >
          {subtitle && (
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "oklch(0.68 0.2 38)" }}>
              {subtitle}
            </p>
          )}
          <h2 className="font-black text-[#f5f1ea] leading-none tracking-[-0.02em] text-3xl md:text-5xl">
            {title}
          </h2>
          {buttonText && (
            <Link
              href={resolveHref(href, base)}
              className="mt-10 self-start inline-flex items-center text-[#141210] text-sm font-bold px-8 py-4 uppercase tracking-[0.06em] hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "oklch(0.68 0.2 38)" }}
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  const isCompact = variant === "compact";

  return (
    <section
      className={`relative ${isCompact ? "h-64" : "min-h-[580px]"} overflow-hidden flex items-end ${transparent ? (isCompact ? "-mt-16" : "-mt-[72px]") : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "#1c1916",
      }}
    >
      {image && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 w-full px-8 pb-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "oklch(0.68 0.2 38)" }}>
          {subtitle ?? "New Drop"}
        </p>
        <h1 className="font-black text-[#f5f1ea] leading-none tracking-[-0.02em] text-5xl md:text-7xl max-w-[700px]">
          {title}
        </h1>
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-8 inline-flex items-center text-[#141210] text-sm font-bold px-8 py-4 uppercase tracking-[0.06em] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "oklch(0.68 0.2 38)" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
