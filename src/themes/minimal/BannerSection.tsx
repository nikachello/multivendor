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

  if (variant === "compact") {
    return (
      <section
        className={`relative h-64 overflow-hidden ${transparent ? "-mt-[72px]" : ""}`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: image ? undefined : "var(--primary)",
        }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-white/75">{subtitle}</p>}
          {buttonText && (
            <Link
              href={resolveHref(href, shopSlug)}
              className="mt-6 inline-block bg-white text-zinc-900 text-sm font-medium px-7 py-3 hover:bg-zinc-100 transition-colors"
              style={{ borderRadius: "var(--radius)" }}
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
      className={`relative h-[600px] overflow-hidden ${transparent ? "-mt-[72px]" : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "var(--primary)",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-16 text-center text-white">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-sm text-white/75 md:text-base">{subtitle}</p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, shopSlug)}
            className="mt-8 inline-block bg-white text-zinc-900 text-sm font-semibold px-8 py-3.5 hover:bg-zinc-100 transition-colors"
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
