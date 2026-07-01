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
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} flex flex-col ${alignClass} max-w-3xl mx-auto`}>
        {title && (
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 leading-snug">
            {title}
          </h2>
        )}
        {body && (
          <p className="text-neutral-500 mt-4 text-sm leading-relaxed max-w-prose">
            {body}
          </p>
        )}
        {buttonText && buttonHref && (
          <div className="mt-8">
            <Link
              href={buttonHref}
              className="inline-block border border-neutral-900 text-neutral-900 text-xs font-medium tracking-wide uppercase px-8 py-3 hover:bg-neutral-900 hover:text-white transition-colors"
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
