import Link from "next/link";
import Image from "next/image";
import { BannerSectionProps } from "@/lib/types/sections";

function resolveHref(href: string, shopSlug: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href === "/") return `/shop/${shopSlug}`;
  return `/shop/${shopSlug}${href}`;
}

type Props = BannerSectionProps & { shopSlug?: string };

export default function BannerSplit({
  title,
  subtitle,
  image,
  buttonText,
  href = "/",
  shopSlug = "",
}: Props) {
  return (
    <section className="grid md:grid-cols-2 min-h-[500px]">
      <div className="relative overflow-hidden bg-neutral-100 min-h-[300px]">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
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
            href={resolveHref(href, shopSlug)}
            className="mt-8 inline-block bg-neutral-900 px-8 py-3.5 text-sm text-white hover:bg-neutral-700 transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
