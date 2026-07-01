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
  const alignClass =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} flex flex-col ${alignClass} max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
        {title && (
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight text-neutral-900 mb-6">
            {title}
          </h2>
        )}
        {body && (
          <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">{body}</p>
        )}
        {buttonText && buttonHref && (
          <Link
            href={buttonHref}
            className="mt-8 inline-block border border-neutral-900 text-neutral-900 text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default RichTextSection;
