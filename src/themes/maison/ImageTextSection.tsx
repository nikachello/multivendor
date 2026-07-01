import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import type { ImageTextSectionProps } from "@/lib/types/sections";

type Props = ImageTextSectionProps & { themeConfig: ThemeConfig };

const ImageTextSection = ({
  image,
  title,
  body,
  buttonText,
  buttonHref,
  imagePosition = "left",
  themeConfig,
}: Props) => {
  if (!title && !body && !image) return null;

  const imageCol = (
    <div
      className="relative overflow-hidden bg-[var(--surface)]"
      style={{ aspectRatio: "3/4", minHeight: 400 }}
    >
      {image ? (
        <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );

  const textCol = (
    <div className="flex flex-col justify-center px-12 py-16 md:py-24">
      {title && (
        <h2 className={`${themeConfig.type.displayFont} text-3xl md:text-4xl font-light text-[var(--primary)] leading-snug`}>
          {title}
        </h2>
      )}
      {body && (
        <p className="mt-6 text-sm italic leading-[1.9] text-[var(--muted)]">{body}</p>
      )}
      {buttonText && buttonHref && (
        <div className="mt-10">
          <Link
            href={buttonHref}
            className="inline-block border border-[var(--primary)] text-[var(--primary)] text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
            style={{ borderRadius: "var(--radius)" }}
          >
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
          {imagePosition === "right" ? (
            <>
              {textCol}
              {imageCol}
            </>
          ) : (
            <>
              {imageCol}
              {textCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
