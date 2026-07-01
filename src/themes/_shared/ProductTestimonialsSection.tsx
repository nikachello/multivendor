import type { ThemeConfig } from "@/themes/types";
import type { ProductTestimonialsSectionProps } from "@/lib/types/sections";
import { getProductTestimonials } from "@/lib/db/queries";

type Props = ProductTestimonialsSectionProps & { themeConfig: ThemeConfig };

function Stars({ value }: { value: number | null }) {
  if (!value) return null;
  return (
    <span className="text-yellow-400">
      {"★".repeat(value)}
      <span className="text-gray-200">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export default async function ProductTestimonialsSection({
  shopId,
  productId,
  title,
  themeConfig,
}: Props) {
  if (!shopId || !productId) return null;

  const testimonials = await getProductTestimonials(shopId, productId);
  if (!testimonials.length) return null;

  const ratedOnes = testimonials.filter((t) => t.rating);
  const avg = ratedOnes.length
    ? ratedOnes.reduce((s, t) => s + (t.rating ?? 0), 0) / ratedOnes.length
    : null;

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="mb-8">
          <h2 className={themeConfig.type.sectionHeading}>
            {title || "Customer reviews"}
          </h2>
          {avg !== null && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-400">{"★".repeat(Math.round(avg))}</span>
              <span className={themeConfig.type.body}>
                {avg.toFixed(1)} out of 5 &middot; {testimonials.length} review{testimonials.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-lg p-5 border border-[var(--subtle)] bg-[var(--surface)]"
            >
              {t.rating && (
                <div className="mb-3">
                  <Stars value={t.rating} />
                </div>
              )}
              {themeConfig.sections.testimonial.quoteVisible && (
                <p className={themeConfig.sections.testimonial.quoteClass}>&ldquo;</p>
              )}
              <p className={`italic leading-relaxed ${themeConfig.type.body}`}>
                &ldquo;{t.testimony}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--subtle)]">
                <p className={themeConfig.type.label}>{t.name}</p>
                {t.position && (
                  <p className={`mt-0.5 ${themeConfig.type.body}`}>{t.position}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
