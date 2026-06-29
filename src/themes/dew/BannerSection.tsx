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
      <section
        className="w-full py-4 px-6"
        style={{ backgroundColor: "var(--sage, #E7EDE0)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
          {[title, subtitle].filter(Boolean).map((phrase, i, arr) => (
            <span key={i} className="flex items-center gap-5">
              <span className="font-jakarta text-[14px] font-medium text-[#2C2530]">{phrase}</span>
              {i < arr.length - 1 && (
                <span className="font-jakarta text-[var(--accent)] text-[13px] select-none">✦</span>
              )}
            </span>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 border-t border-b border-[var(--subtle)]">
        <div
          className="relative"
          style={{
            minHeight: "clamp(360px, 44vw, 560px)",
            background: "radial-gradient(115% 115% at 32% 26%, #FFFFFF, var(--sage, #E7EDE0))",
            borderRadius: "0",
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={title ?? ""}
              fill
              className="object-cover"
              unoptimized
              style={{ borderRadius: "0" }}
            />
          ) : null}
        </div>
        <div
          className="flex flex-col justify-center bg-[var(--page-bg)]"
          style={{ padding: "clamp(44px, 6vw, 84px)" }}
        >
          {subtitle && (
            <p className="font-jakarta font-bold text-[12px] tracking-[0.14em] text-[var(--accent)] mb-5">
              {subtitle}
            </p>
          )}
          {title && (
            <h2
              className="font-jakarta font-bold text-[#2C2530] tracking-[-0.02em] leading-[1.06] mb-6"
              style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}
            >
              {title}
            </h2>
          )}
          {buttonText && (
            <Link
              href={resolveHref(href, shopSlug)}
              className="self-start font-jakarta font-semibold text-[15px] text-white px-8 py-4 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#2C2530", borderRadius: "var(--pill)" }}
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    );
  }

  // cover (default) — radial-gradient bg, left text block, two pill CTAs
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: "clamp(440px, 68vh, 720px)",
        background: "radial-gradient(ellipse 130% 120% at 80% 60%, #D9D2F2, #E7DCEF 40%, var(--page-bg, #F4ECE6))",
      }}
    >
      {image && (
        <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized priority />
      )}
      <div
        className="relative z-10"
        style={{ padding: "clamp(44px, 7vw, 88px)", maxWidth: "560px" }}
      >
        {subtitle && (
          <p className="font-jakarta font-bold text-[12px] tracking-[0.14em] text-[var(--accent)] mb-5">
            {subtitle}
          </p>
        )}
        {title && (
          <h1
            className="font-jakarta font-bold text-[#2C2530] tracking-[-0.03em] leading-[1.02] mb-6"
            style={{ fontSize: "clamp(40px, 6.4vw, 76px)" }}
          >
            {title}
          </h1>
        )}
        {buttonText && (
          <div className="flex flex-wrap gap-3">
            <Link
              href={resolveHref(href, shopSlug)}
              className="font-jakarta font-semibold text-[15px] text-white px-8 py-4 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--accent)", borderRadius: "var(--pill)" }}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
