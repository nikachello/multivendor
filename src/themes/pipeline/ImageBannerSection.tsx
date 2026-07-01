"use client";

import Link from "next/link";

type Props = {
  image?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  contentPosition?: "left" | "center" | "right";
  overlayOpacity?: number;
  shopBase?: string;
  shopSlug?: string;
};

function resolveHref(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

const ImageBannerSection = ({
  image,
  title,
  subtitle,
  buttonText,
  href = "/",
  contentPosition = "center",
  overlayOpacity = 30,
  shopBase,
  shopSlug = "",
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const alignClass =
    contentPosition === "left"
      ? "items-center justify-start pl-10 md:pl-20 text-left"
      : contentPosition === "right"
      ? "items-center justify-end pr-10 md:pr-20 text-right"
      : "items-center justify-center text-center";

  return (
    <section
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "#1a1a1a",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />
      <div className={`relative z-10 flex h-full flex-col px-0 text-white ${alignClass}`}>
        {subtitle && (
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-3">
            {subtitle}
          </p>
        )}
        {title && (
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight max-w-xl">
            {title}
          </h2>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-7 inline-block border border-white text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-white hover:text-neutral-900 transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default ImageBannerSection;
