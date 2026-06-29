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
}: Props) => {
  const imageFirst = imagePosition === "left";

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 items-stretch"
      style={{ backgroundColor: "#1B1714", color: "#EFE8DA" }}
    >
      <div
        className={`relative ${imageFirst ? "" : "md:order-2"}`}
        style={{ minHeight: "clamp(380px, 44vw, 580px)" }}
      >
        {image ? (
          <Image src={image} alt={title ?? ""} fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: "#2a2620" }} />
        )}
      </div>
      <div
        className={`flex flex-col justify-center ${imageFirst ? "" : "md:order-1"}`}
        style={{ padding: "clamp(46px, 6vw, 88px)" }}
      >
        {title && (
          <h2
            className="font-bodoni font-medium leading-[1.04] tracking-[-0.01em] mb-6"
            style={{ fontSize: "clamp(30px, 3.6vw, 52px)", color: "#EFE8DA" }}
          >
            {title}
          </h2>
        )}
        {body && (
          <p
            className="text-[16px] leading-[1.7] mb-8"
            style={{ color: "#CFC6B5", maxWidth: "46ch" }}
          >
            {body}
          </p>
        )}
        {buttonText && buttonHref && (
          <Link
            href={buttonHref}
            className="self-start text-[12px] tracking-[0.18em] uppercase pb-1 transition-colors hover:text-[var(--accent)] hover:border-[var(--accent)]"
            style={{ color: "#EFE8DA", borderBottom: "1px solid #EFE8DA" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default ImageTextSection;
