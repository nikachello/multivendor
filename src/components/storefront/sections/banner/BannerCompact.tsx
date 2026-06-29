import Link from "next/link";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string; shopBase?: string; transparent?: boolean };

export default function BannerCompact({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
  shopBase,
  transparent = false,
}: Props) {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  return (
    <section
      className={`relative h-[320px] overflow-hidden ${transparent ? "-mt-[92px]" : ""}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center text-white">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-md text-sm text-white/80">{subtitle}</p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-6 inline-block bg-white text-neutral-900 px-7 py-3 text-sm hover:bg-neutral-100 transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
