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
      className="relative overflow-hidden shadow-md"
      style={{ aspectRatio: "4/5", borderRadius: "var(--radius)" }}
    >
      {image ? (
        <Image src={image} alt={title ?? ""} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-[var(--subtle)]" />
      )}
    </div>
  );

  const textCol = (
    <div
      className="flex flex-col justify-center px-8 py-10 bg-[var(--surface)]"
      style={{ borderRadius: "calc(var(--radius) * 1.5)" }}
    >
      {title && (
        <h2 className={`${themeConfig.type.sectionHeading} text-2xl md:text-3xl leading-snug`}>
          {title}
        </h2>
      )}
      {body && (
        <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">{body}</p>
      )}
      {buttonText && buttonHref && (
        <div className="mt-8">
          <Link
            href={buttonHref}
            className="inline-block bg-[var(--accent)] text-white text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity"
            style={{ borderRadius: "999px" }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
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
