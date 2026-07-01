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
      className={`${themeConfig.layout.sectionPy} bg-[var(--surface)]`}
    >
      <div className={`${themeConfig.layout.contentPx} flex flex-col ${alignClass} max-w-2xl mx-auto`}>
        {title && (
          <h2 className={`${themeConfig.type.sectionHeading} text-2xl md:text-3xl leading-snug`}>
            <span
              className="inline-block border-b-2 border-[var(--accent)] pb-1"
            >
              {title}
            </span>
          </h2>
        )}
        {body && (
          <p className="mt-5 text-sm text-[var(--muted)] leading-relaxed max-w-prose">{body}</p>
        )}
        {buttonText && buttonHref && (
          <div className="mt-8">
            <Link
              href={buttonHref}
              className="inline-block bg-[var(--accent)] text-white text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity"
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
