import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";

type CollageItem = {
  image?: string;
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
};

type Props = {
  items?: CollageItem[];
  layout?: "asymmetric" | "grid" | "mosaic";
  themeConfig: ThemeConfig;
};

const CollageSection = ({
  items = [],
  layout = "asymmetric",
  themeConfig,
}: Props) => {
  if (!items.length) return null;

  const [first, second, third] = items;

  if (layout === "grid") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 md:grid-cols-4 gap-3`}>
          {items.slice(0, 4).map((item, i) => (
            <CollageCard key={i} item={item} aspectRatio="4/5" />
          ))}
        </div>
      </section>
    );
  }

  if (layout === "mosaic") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
        <div className={`${themeConfig.layout.contentPx} grid grid-cols-2 grid-rows-2 gap-3`} style={{ gridTemplateRows: "auto auto" }}>
          <div className="row-span-2">
            {first && <CollageCard item={first} aspectRatio="2/3" />}
          </div>
          <div>{second && <CollageCard item={second} aspectRatio="4/3" />}</div>
          <div>{third && <CollageCard item={third} aspectRatio="4/3" />}</div>
        </div>
      </section>
    );
  }

  // asymmetric (default) — left large portrait, right 2 stacked
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-3 md:gap-5`}>
        {/* Left - large */}
        <div>
          {first && <CollageCard item={first} aspectRatio="3/4" />}
        </div>
        {/* Right - two stacked */}
        <div className="flex flex-col gap-3 md:gap-5">
          {second && <CollageCard item={second} aspectRatio="4/3" />}
          {third && <CollageCard item={third} aspectRatio="4/3" />}
        </div>
      </div>
    </section>
  );
};

function CollageCard({ item, aspectRatio }: { item: CollageItem; aspectRatio: string }) {
  const inner = (
    <div className="relative w-full overflow-hidden bg-neutral-50 group" style={{ aspectRatio }}>
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title ?? ""}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
        />
      ) : (
        <div className="w-full h-full bg-neutral-100" />
      )}
      {(item.title || item.buttonText) && (
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          {item.title && (
            <p className="text-white text-sm font-semibold tracking-wide">{item.title}</p>
          )}
          {item.buttonText && (
            <span className="border border-white text-white text-[10px] font-semibold tracking-[0.15em] uppercase px-6 py-2.5">
              {item.buttonText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (item.buttonUrl) {
    return <Link href={item.buttonUrl}>{inner}</Link>;
  }
  return inner;
}

export default CollageSection;
