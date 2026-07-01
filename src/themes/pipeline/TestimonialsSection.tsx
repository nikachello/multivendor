import type { ThemeConfig } from "@/themes/types";
import type { TestimonialsSectionProps } from "@/lib/types/sections";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { Marquee } from "@/components/ui/marquee";

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
        <Marquee pauseOnHover repeat={6} className="[--duration:40s]">
          {testimonials.map((t) => (
            <div key={t.id} className="w-80 flex-shrink-0 px-8 border-l border-neutral-100 first:border-l-0">
              <p className="text-sm text-neutral-600 leading-relaxed italic">&ldquo;{t.testimony}&rdquo;</p>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400 mt-5">
                — {t.name}
              </p>
            </div>
          ))}
        </Marquee>
      </section>
    );
  }

  // GRID: large clean cards, no chrome
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16`}>
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.id} className="flex flex-col">
            {/* Decorative opening mark */}
            <span className="text-5xl font-serif leading-none text-neutral-200 mb-4 select-none">&#8220;</span>
            <p className="text-sm text-neutral-600 leading-relaxed flex-1">{t.testimony}</p>
            <div className="w-10 border-t-2 border-neutral-900 my-6" />
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-900">{t.name}</p>
            {t.position && (
              <p className="text-[10px] text-neutral-400 mt-0.5 tracking-wide">{t.position}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
