import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import type { RichTextSectionProps } from "@/lib/types/sections";

type Props = RichTextSectionProps & { themeConfig: ThemeConfig };

const RichTextSection = ({
  title,
  body,
  align = "center",
  buttonText,
  buttonHref,
  themeConfig,
}: Props) => {
  if (!title && !body) return null;

  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <section
      className={`${themeConfig.layout.sectionPy}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className={`${themeConfig.layout.contentPx} flex flex-col ${alignClass} max-w-3xl mx-auto`}>
        {title && (
          <h2
            className={`${themeConfig.type.displayFont} font-light text-[var(--primary)] leading-snug`}
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {title}
          </h2>
        )}
        {body && (
          <p className="mt-5 text-sm text-[var(--muted)] leading-[1.9] max-w-prose">{body}</p>
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
    </section>
  );
};

export default RichTextSection;
