"use client";

import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";
import BannerSplit from "@/components/storefront/sections/banner/BannerSplit";

function resolveHref(href: string, shopSlug: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return `/shop/${shopSlug}`;
  return `/shop/${shopSlug}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string; transparent?: boolean };

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
  transparent = false,
  variant = "cover",
}: Props) => {
  if (variant === "split") {
    return <BannerSplit title={title} subtitle={subtitle} image={image} buttonText={buttonText} href={href} shopSlug={shopSlug} />;
  }

  // cover & compact — warm amber tones
  return (
    <section
      className={`relative ${variant === "compact" ? "h-64" : "h-[560px]"} overflow-hidden ${transparent ? (variant === "compact" ? "-mt-16" : "-mt-[72px]") : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "#f1e6cf",
      }}
    >
      {image && <div className="absolute inset-0 bg-black/35" />}
      <div className={`relative z-10 flex h-full flex-col items-center justify-end px-6 pb-14 text-center ${image ? "text-white" : "text-[#2b2415]"}`}>
        <h1 className="font-display max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className={`mt-4 max-w-lg text-sm md:text-base ${image ? "text-white/75" : "text-[#7a6b4a]"}`}>{subtitle}</p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, shopSlug)}
            className="mt-8 inline-block text-[#fdf8ee] text-sm font-semibold px-8 py-3.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "oklch(0.55 0.12 68)", borderRadius: "8px" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
