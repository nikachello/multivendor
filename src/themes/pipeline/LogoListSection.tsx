import Image from "next/image";
import type { ThemeConfig } from "@/themes/types";

type LogoItem = {
  url: string;
  alt?: string;
};

type Props = {
  title?: string;
  logos?: LogoItem[];
  logoWidth?: "sm" | "md" | "lg";
  themeConfig: ThemeConfig;
};

const widthClass: Record<string, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-12",
};

const LogoListSection = ({
  title,
  logos = [],
  logoWidth = "md",
  themeConfig,
}: Props) => {
  if (!logos.length) return null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        {title && (
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 text-center mb-10">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((logo, i) => (
            <div key={i} className={`relative ${widthClass[logoWidth] ?? "h-8"} w-28 opacity-40 hover:opacity-70 transition-opacity`}>
              <Image
                src={logo.url}
                alt={logo.alt ?? `Logo ${i + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoListSection;
