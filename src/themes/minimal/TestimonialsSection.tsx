import type { ThemeConfig } from "@/themes/types";
import type { TestimonialsSectionProps } from "@/lib/types/sections";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { Marquee } from "@/components/ui/marquee";

type Props = TestimonialsSectionProps & { themeConfig: ThemeConfig };

const TestimonialCard = ({ testimony, name }: { testimony: string; name: string }) => (
  <div className="w-72 flex-shrink-0 px-8">
    <p className="text-sm italic text-neutral-600 leading-relaxed">{testimony}</p>
    <hr className="my-4 border-neutral-200" />
    <p className="text-xs uppercase tracking-widest text-neutral-400">{name}</p>
  </div>
);

const TestimonialsSection = async ({ shopId, variant = "grid", themeConfig }: Props) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok) return null;

  const testimonials = result.data.filter((t) => !t.productId && t.isActive);
  if (!testimonials.length) return null;

  if (variant === "marquee") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)] overflow-hidden`}>
        <Marquee pauseOnHover repeat={6} className="[--duration:35s]">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimony={t.testimony} name={t.name} />
          ))}
        </Marquee>
      </section>
    );
  }

  // GRID: no card background, quote text then attribution
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16`}>
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.id} className="flex flex-col">
            <p className="text-sm italic text-neutral-600 leading-relaxed flex-1">{t.testimony}</p>
            <hr className="my-5 border-neutral-200" />
            <p className="text-xs uppercase tracking-widest text-neutral-400">{t.name}</p>
            {t.position && (
              <p className="text-xs text-neutral-300 mt-0.5">{t.position}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
