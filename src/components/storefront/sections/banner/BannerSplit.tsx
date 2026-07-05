import Link from "next/link";
import Image from "next/image";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, base: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return base || "/";
  return `${base}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string; shopBase?: string };

export default function BannerSplit({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
  shopBase,
  imagePosition = "center",
}: Props) {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  return (
    <section className="grid md:grid-cols-2 min-h-[500px]">
      <div className="relative overflow-hidden bg-neutral-100 min-h-[300px]">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        )}
      </div>
      <div className="flex flex-col items-start justify-center px-10 py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 max-w-md">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-neutral-500 text-sm leading-relaxed max-w-sm">
            {subtitle}
          </p>
        )}
        {buttonText && (
          <Link
            href={resolveHref(href, base)}
            className="mt-8 inline-block px-8 py-3.5 text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--primary)", color: "var(--secondary)", borderRadius: "var(--radius)" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
