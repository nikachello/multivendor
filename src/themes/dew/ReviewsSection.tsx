"use client";

import { ReviewsSectionProps } from "@/lib/types/sections";
import { ThemeConfig } from "@/themes/types";

type Props = ReviewsSectionProps & { themeConfig: ThemeConfig };

export default function ReviewsSection({
  title,
  rating,
  reviewCount,
  items = [],
  themeConfig,
}: Props) {
  return (
    <section
      className={`${themeConfig.layout.sectionPy} ${themeConfig.layout.contentPx}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="max-w-5xl mx-auto">
        {(rating || reviewCount) && (
          <p className="font-jakarta font-bold text-[13px] tracking-[0.14em] text-[var(--accent)] text-center mb-4">
            ★ {rating} average{reviewCount ? ` · ${reviewCount} reviews` : ""}
          </p>
        )}
        {title && (
          <h2
            className={`${themeConfig.type.sectionHeading} text-center mb-10`}
            style={{ fontSize: "clamp(26px, 4vw, 50px)" }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-6"
              style={{
                backgroundColor: "var(--page-bg)",
                borderRadius: "var(--radius)",
              }}
            >
              <span className="text-[var(--accent)] text-[16px] tracking-[0.08em]">
                ★★★★★
              </span>
              <p className={`${themeConfig.type.body} flex-1`}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-jakarta font-semibold text-[13px] text-[#2C2530]">
                  {item.author}
                </span>
                <span
                  className="font-jakarta font-semibold text-[11px] text-[#2C2530] px-2 py-0.5"
                  style={{
                    backgroundColor: "var(--sage, #E7EDE0)",
                    borderRadius: "999px",
                  }}
                >
                  ✓ Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
