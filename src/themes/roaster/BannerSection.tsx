"use client";

import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";
import BannerSplit from "@/components/storefront/sections/banner/BannerSplit";

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
    return <BannerSplit title={title} subtitle={subtitle} image={image} buttonText={buttonText} href={href} shopSlug={shopSlug} shopBase={shopBase} />;
  }

  if (variant === "compact") {
    return (
      <section
        className={`relative h-56 overflow-hidden ${transparent ? "-mt-[68px]" : ""}`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: image ? undefined : "#ecdfc9",
        }}
      >
        {image && <div className="absolute inset-0 bg-black/40" />}
        <div className={`relative z-10 flex h-full flex-col items-start justify-end px-8 pb-10 ${image ? "text-white" : "text-[#39291a]"}`}>
          <h2 className="font-display text-2xl font-semibold leading-tight">{title}</h2>
          {subtitle && <p className={`mt-2 text-sm ${image ? "text-white/75" : "text-[#6b5640]"}`}>{subtitle}</p>}
          {buttonText && (
            <Link
              href={resolveHref(href, base)}
              className="mt-5 inline-block text-[#f6ede0] text-sm font-semibold px-6 py-2.5 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "oklch(0.42 0.07 50)", borderRadius: "8px" }}
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
      className={`relative h-[540px] overflow-hidden ${transparent ? "-mt-[68px]" : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "#ecdfc9",
      }}
    >
      {image && <div className="absolute inset-0 bg-black/40" />}
      <div className={`relative z-10 flex h-full flex-col items-start justify-end px-10 pb-14 ${image ? "text-white" : "text-[#39291a]"}`}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: image ? "rgba(255,255,255,0.7)" : "oklch(0.42 0.07 50)" }}>
          {subtitle}
        </p>
        <h1 className="font-display max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-8 inline-block text-[#f6ede0] text-sm font-semibold px-8 py-3.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "oklch(0.42 0.07 50)", borderRadius: "8px" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
