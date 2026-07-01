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
  const imageCol = (
    <div className="relative w-full overflow-hidden bg-neutral-50" style={{ aspectRatio: "4/5" }}>
      {image ? (
        <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized />
      ) : (
        <div className="w-full h-full bg-neutral-100" />
      )}
    </div>
  );

  const textCol = (
    <div className="flex flex-col justify-center py-10 md:py-0 md:px-12">
      {title && (
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight text-neutral-900 mb-6">
          {title}
        </h2>
      )}
      {body && (
        <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">{body}</p>
      )}
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className="mt-8 inline-block border border-neutral-900 text-neutral-900 text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors self-start"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-2 gap-0 items-center`}>
        {imagePosition === "left" ? (
          <>
            {imageCol}
            {textCol}
          </>
        ) : (
          <>
            {textCol}
            {imageCol}
          </>
        )}
      </div>
    </section>
  );
};

export default ImageTextSection;
