import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";

type ColumnItem = {
  image?: string;
  title?: string;
  text?: string;
  buttonText?: string;
  buttonUrl?: string;
};

type Props = {
  title?: string;
  columns?: 2 | 3 | 4;
  items?: ColumnItem[];
  themeConfig: ThemeConfig;
};

const colClass: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const MultiColumnSection = ({
  title,
  columns = 3,
  items = [],
  themeConfig,
}: Props) => {
  if (!items.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 mb-12">
            {title}
          </p>
        )}
        <div className={`grid grid-cols-1 ${colClass[columns] ?? "md:grid-cols-3"} gap-8 md:gap-12`}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col">
              {item.image && (
                <div className="relative w-full mb-6 overflow-hidden bg-neutral-50" style={{ aspectRatio: "4/5" }}>
                  <Image src={item.image} alt={item.title ?? ""} fill className="object-cover" />
                </div>
              )}
              {item.title && (
                <p className="text-sm font-semibold tracking-wide text-neutral-900 mb-3">
                  {item.title}
                </p>
              )}
              {item.text && (
                <p className="text-sm text-neutral-500 leading-relaxed flex-1">{item.text}</p>
              )}
              {item.buttonText && item.buttonUrl && (
                <Link
                  href={item.buttonUrl}
                  className="mt-5 inline-block border border-neutral-900 text-neutral-900 text-[10px] font-semibold tracking-[0.15em] uppercase px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors self-start"
                >
                  {item.buttonText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MultiColumnSection;
