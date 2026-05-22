"use client";

import { useRouter } from "next/navigation";

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  href?: string;
};

const Banner = ({
  title,
  subtitle,
  image,
  buttonText,
  href = "/shop",
}: Props) => {
  const router = useRouter();

  return (
    <div
      className="relative h-[600px] bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* content */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-white text-center px-5 pb-16">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-sm md:text-base text-white/80">{subtitle}</p>
        )}

        {buttonText && (
          <button
            onClick={() => router.push(href)}
            className="mt-6 px-6 py-2 bg-white text-black text-sm rounded-full hover:bg-gray-200 transition"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
