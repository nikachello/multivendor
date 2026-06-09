"use client";
import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, shopSlug: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return `/shop/${shopSlug}`;
  return `/shop/${shopSlug}${href}`;
}

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
}: BannerSectionProps & { shopSlug?: string }) => {
  return (
    <section
      className="relative h-[600px] overflow-hidden -mt-[92px]"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-16 text-center text-white">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
            {subtitle}
          </p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, shopSlug)}
            className="mt-8 inline-block bg-[#C25447] px-8 py-4 text-sm text-white transition hover:opacity-90"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
