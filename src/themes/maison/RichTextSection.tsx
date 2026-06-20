import Link from "next/link";
import { RichTextSectionProps } from "@/lib/types/sections";

const RichTextSection = ({ title, body, align = "center", buttonText, buttonHref }: RichTextSectionProps) => {
  const textAlign = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className={`px-5 md:px-10 max-w-2xl ${textAlign}`}>
        {title && (
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#1C1C1C] leading-tight">
            {title}
          </h2>
        )}
        {body && (
          <p className="mt-5 text-sm text-[#8A8072] leading-[1.9] tracking-[0.02em]">
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
    </section>
  );
};

export default RichTextSection;
