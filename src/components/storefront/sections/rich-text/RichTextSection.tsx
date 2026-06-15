import Link from "next/link";
import { RichTextSectionProps } from "@/lib/types/sections";

export default function RichTextSection({
  title,
  body,
  align = "center",
  buttonText,
  buttonHref,
}: RichTextSectionProps) {
  const isCenter = align === "center";

  return (
    <section className={`py-16 ${isCenter ? "text-center" : "text-left"}`}>
      <div className={`max-w-2xl ${isCenter ? "mx-auto" : ""}`}>
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
            className="mt-8 inline-block px-7 py-3 text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--primary)", color: "var(--secondary)", borderRadius: "var(--radius)" }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
