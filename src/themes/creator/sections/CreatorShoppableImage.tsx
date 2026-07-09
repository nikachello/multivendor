import Image from "next/image";
import Link from "next/link";

type ProductLink = { id: string; label: string; url: string };

type Props = {
  image?: string;
  caption?: string;
  products?: ProductLink[];
  shopBase?: string;
};

function resolveUrl(url: string, base: string): string {
  if (!url || url === "#") return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${base}${url}`;
}

export default function CreatorShoppableImage({ image, caption, products = [], shopBase = "" }: Props) {
  if (!image && products.length === 0) return null;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {image && (
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src={image}
            alt={caption ?? "Shop this"}
            width={600}
            height={750}
            className="w-full object-cover"
            style={{ aspectRatio: "4/5" }}
          />
        </div>
      )}

      {caption && (
        <p className="text-sm text-[var(--creator-muted)] mt-3 leading-relaxed">{caption}</p>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={resolveUrl(p.url, shopBase)}
              target={p.url.startsWith("http") ? "_blank" : undefined}
              rel={p.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 rounded-xl bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] px-3 py-2 text-sm font-medium text-[var(--creator-on-surface)] hover:ring-[var(--primary)] transition-all"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{p.label}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
