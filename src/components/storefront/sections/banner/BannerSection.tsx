"use client";

import { useRouter } from "next/navigation";
import { BannerSectionProps } from "@/lib/types/sections";

const BannerSection = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/shop",
}: BannerSectionProps) => {
  const router = useRouter();

  return (
    <section
      className="relative h-[600px] overflow-hidden"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-16 text-center text-white">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
            {subtitle}
          </p>
        )}

        {buttonText && (
          <button
            onClick={() => router.push(href)}
            className="mt-8 bg-[#C25447] px-8 py-4 text-sm text-white transition hover:opacity-90"
          >
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
};

export default BannerSection;
