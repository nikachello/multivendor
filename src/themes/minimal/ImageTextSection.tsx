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
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-neutral-50">
      {image ? (
        <Image src={image} alt={title ?? ""} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-neutral-100" />
      )}
    </div>
  );

  const textCol = (
    <div className="flex flex-col justify-center px-10 py-16 md:py-24 bg-[var(--page-bg)]">
      {title && (
        <h2 className="text-2xl font-semibold text-neutral-900 leading-snug">{title}</h2>
      )}
      {body && (
        <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-prose">{body}</p>
      )}
      {buttonText && buttonHref && (
        <div className="mt-8">
          <Link
            href={buttonHref}
            className="inline-block bg-neutral-900 text-white text-xs font-medium tracking-wide uppercase px-8 py-3 hover:opacity-80 transition-opacity"
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
        <div className="grid grid-cols-1 md:grid-cols-2">
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
