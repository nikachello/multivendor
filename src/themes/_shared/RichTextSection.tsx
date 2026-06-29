import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import type { RichTextSectionProps } from "@/lib/types/sections";

type Props = RichTextSectionProps & { themeConfig: ThemeConfig };

const RichTextSection = ({ title, body, align = "center", buttonText, buttonHref, themeConfig }: Props) => {
  const isCenter = align === "center";

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div
        className={`${themeConfig.layout.contentPx} max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}
      >
        {title && (
          <h2 className={themeConfig.type.sectionHeading}>{title}</h2>
        )}
        {body && (
          <p className={`mt-5 ${themeConfig.type.body}`}>{body}</p>
        )}
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
    </section>
  );
};

export default RichTextSection;
