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
  imagePosition = "center",
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  if (variant === "split") {
    return <BannerSplit title={title} subtitle={subtitle} image={image} buttonText={buttonText} href={href} shopSlug={shopSlug} shopBase={shopBase} />;
  }

  if (variant === "compact") {
    return (
      <section
        className="rounded-xl mx-4 my-4 overflow-hidden"
        style={{ backgroundColor: "oklch(0.92 0.06 55)" }}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="font-bold text-lg leading-tight" style={{ color: "oklch(0.42 0.12 45)" }}>{title}</h2>
            {subtitle && <p className="text-sm mt-1" style={{ color: "oklch(0.48 0.1 48)" }}>{subtitle}</p>}
          </div>
          {buttonText && (
            <Link
              href={resolveHref(href, base)}
              className="shrink-0 text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "oklch(0.68 0.16 50)", borderRadius: "8px" }}
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
      className="relative h-[500px] overflow-hidden"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: imagePosition,
        backgroundColor: image ? undefined : "oklch(0.55 0.13 145)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-14 text-center text-white">
        <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">{subtitle}</p>}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-8 inline-block bg-white font-bold text-sm px-8 py-3.5 hover:bg-zinc-100 transition-colors"
            style={{ color: "oklch(0.55 0.13 145)", borderRadius: "8px" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
