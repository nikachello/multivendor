"use client";

import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
  image?: string;
  buttonText?: string;
  href?: string;
  shopBase?: string;
  shopSlug?: string;
  transparent?: boolean;
  contentPosition?: "bottom-left" | "bottom-center" | "center" | "center-left";
  overlayOpacity?: number;
  height?: "full" | "large" | "medium";
};

function resolveHref(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopBase,
  shopSlug = "",
  transparent = false,
  contentPosition = "bottom-left",
  overlayOpacity = 35,
  height = "full",
}: Props) => {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;

  const heightClass =
    height === "full"
      ? "h-screen min-h-[600px]"
      : height === "large"
      ? "h-[80vh] min-h-[500px]"
      : "h-[55vh] min-h-[400px]";

  const positionClass =
    contentPosition === "bottom-left"
      ? "items-end justify-start pb-16 md:pb-20 pl-6 md:pl-16 text-left"
      : contentPosition === "bottom-center"
      ? "items-end justify-center pb-16 md:pb-20 text-center"
      : contentPosition === "center-left"
      ? "items-center justify-start pl-6 md:pl-16 text-left"
      : "items-center justify-center text-center";

  return (
    <section
      className={`relative overflow-hidden ${heightClass} ${transparent ? "-mt-[73px]" : ""}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "var(--primary)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />
      <div className={`relative z-10 flex h-full flex-col px-0 text-white ${positionClass}`}>
        {subtitle && (
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-4">
            {subtitle}
          </p>
        )}
        {title && (
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] max-w-2xl">
            {title}
          </h1>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-8 inline-block border border-white text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-white hover:text-neutral-900 transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
