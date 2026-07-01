import type { ThemeConfig } from "@/themes/types";
import type { TestimonialsSectionProps } from "@/lib/types/sections";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { Marquee } from "@/components/ui/marquee";
import TestimonialCard from "@/components/storefront/sections/testimonials/TestimonialCard";

type Props = TestimonialsSectionProps & { themeConfig: ThemeConfig };

const TestimonialsSection = async ({ shopId, variant = "grid", themeConfig }: Props) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok) return null;

  const testimonials = result.data.filter((t) => !t.productId && t.isActive);
  if (!testimonials.length) return null;

  if (variant === "marquee") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)] overflow-hidden`}>
        <Marquee pauseOnHover repeat={6} className="[--duration:30s]">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </Marquee>
      </section>
    );
  }

  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={themeConfig.layout.contentPx}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="flex flex-col">
              {themeConfig.sections.testimonial.quoteVisible && (
                <p className={themeConfig.sections.testimonial.quoteClass}>&ldquo;</p>
              )}
              <p className={`italic leading-relaxed flex-1 ${themeConfig.type.body}`}>
                {t.testimony}
              </p>
              <div className="mt-6 pt-5 border-t border-[var(--subtle)]">
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
};

export default TestimonialsSection;
