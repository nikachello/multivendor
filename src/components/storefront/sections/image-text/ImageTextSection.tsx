import Link from "next/link";
import Image from "next/image";
import { ImageTextSectionProps } from "@/lib/types/sections";

export default function ImageTextSection({
  image,
  title,
  body,
  buttonText,
  buttonHref,
  imagePosition = "left",
}: ImageTextSectionProps) {
  const imageBlock = (
    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
      {image && (
        <Image src={image} alt={title || ""} fill className="object-cover" unoptimized />
      )}
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center py-10 md:py-0 md:px-10">
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>
      )}
      {body && (
        <p className="mt-4 text-neutral-500 leading-relaxed text-sm md:text-base whitespace-pre-line">
          {body}
        </p>
      )}
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className="mt-8 inline-block self-start bg-neutral-900 text-white px-7 py-3 text-sm hover:bg-neutral-700 transition-colors"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );

  return (
    <section className="py-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
}
