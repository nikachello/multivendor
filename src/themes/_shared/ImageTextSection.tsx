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
  const imageFirst = imagePosition === "left";

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div
          className={`flex flex-col ${imageFirst ? "md:flex-row" : "md:flex-row-reverse"} overflow-hidden`}
        >
          <div
            className={`relative w-full md:w-1/2 ${themeConfig.components.productImage.bg}`}
            style={{ minHeight: "420px" }}
          >
            {image && (
              <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized />
            )}
          </div>
          <div className="w-full md:w-1/2 flex items-center bg-[var(--surface)]">
            <div className="px-8 md:px-14 py-12 md:py-16 max-w-lg">
              {title && <h2 className={themeConfig.type.sectionHeading}>{title}</h2>}
              {body && <p className={`mt-5 ${themeConfig.type.body}`}>{body}</p>}
              {buttonText && buttonHref && (
                <Link
                  href={buttonHref}
                  className={`mt-8 inline-block ${themeConfig.components.button.className}`}
                  style={themeConfig.components.button.style}
                >
                  {buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
