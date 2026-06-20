import Image from "next/image";
import Link from "next/link";
import { ImageTextSectionProps } from "@/lib/types/sections";

const ImageTextSection = ({
  image,
  title,
  body,
  buttonText,
  buttonHref,
  imagePosition = "left",
}: ImageTextSectionProps) => {
  const imageFirst = imagePosition === "left";

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10">
        <div className={`flex flex-col ${imageFirst ? "md:flex-row" : "md:flex-row-reverse"} overflow-hidden`}>
          {/* Image */}
          <div className="relative w-full md:w-1/2 bg-[#E2DDD5]" style={{ minHeight: "420px" }}>
            {image && (
              <Image
                src={image}
                alt={title ?? ""}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 flex items-center bg-[#EDE9E1]">
            <div className="px-8 md:px-14 py-12 md:py-16 max-w-lg">
              {title && (
                <h2 className="font-display text-3xl md:text-4xl font-light text-[#1C1C1C] leading-tight">
                  {title}
                </h2>
              )}
              {body && (
                <p className="mt-5 text-sm text-[#8A8072] leading-[1.9]">
                  {body}
                </p>
              )}
              {buttonText && buttonHref && (
                <Link
                  href={buttonHref}
                  className="mt-8 inline-block border border-[var(--primary)] text-[var(--primary)] text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
                  style={{ borderRadius: "var(--radius)" }}
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
