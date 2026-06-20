import { getTestimonialsByShop } from "@/lib/db/queries";
import { TestimonialsSectionProps } from "@/lib/types/sections";

const TestimonialsSection = async ({ shopId }: TestimonialsSectionProps) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok || !result.data.length) return null;

  const testimonials = result.data;

  return (
    <section className="py-20 bg-[var(--page-bg)]">
      <div className="px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="flex flex-col">
              <p className="font-display text-5xl font-light text-[#E2DDD5] leading-none mb-4">&ldquo;</p>
              <p className="font-display italic text-lg font-light text-[#1C1C1C] leading-relaxed flex-1">
                {t.testimony}
              </p>
              <div className="mt-6 pt-5 border-t border-[#E2DDD5]">
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#1C1C1C] font-medium">
                  {t.name}
                </p>
                {t.position && (
                  <p className="text-[11px] tracking-[0.08em] text-[#8A8072] mt-0.5">{t.position}</p>
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
