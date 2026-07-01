import type { ThemeConfig } from "@/themes/types";
import type { TestimonialsSectionProps } from "@/lib/types/sections";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { Marquee } from "@/components/ui/marquee";

type Props = TestimonialsSectionProps & { themeConfig: ThemeConfig };

const MaisonTestimonialCard = ({
  testimony,
  name,
  position,
  displayFont,
}: {
  testimony: string;
  name: string;
  position?: string | null;
  displayFont: string;
}) => (
  <div className="w-80 flex-shrink-0 px-10 flex flex-col">
    <p className={`${displayFont} text-6xl font-light text-[var(--subtle)] leading-none mb-4 select-none`}>
      &ldquo;
    </p>
    <p className="text-sm italic leading-relaxed text-[var(--primary)] flex-1">{testimony}</p>
    <hr className="my-5 border-[var(--subtle)]" />
    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">{name}</p>
    {position && (
      <p className="text-[10px] text-[var(--muted)] mt-0.5 opacity-60">{position}</p>
    )}
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
        <Marquee pauseOnHover repeat={6} className="[--duration:40s]">
          {testimonials.map((t) => (
            <MaisonTestimonialCard
              key={t.id}
              testimony={t.testimony}
              name={t.name}
              position={t.position}
              displayFont={themeConfig.type.displayFont}
            />
          ))}
        </Marquee>
      </section>
    );
  }

  // GRID: large opening quote in display font, italic quote, thin rule, name
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16`}>
        {testimonials.slice(0, 3).map((t) => (
          <div key={t.id} className="flex flex-col">
            <p
              className={`${themeConfig.type.displayFont} text-6xl font-light text-[var(--subtle)] leading-none mb-4 select-none`}
            >
              &ldquo;
            </p>
            <p className="text-sm italic leading-relaxed text-[var(--primary)] flex-1">
              {t.testimony}
            </p>
            <hr className="my-5 border-[var(--subtle)]" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--muted)]">
              {t.name}
            </p>
            {t.position && (
              <p className="text-[10px] text-[var(--muted)] mt-0.5 opacity-60">{t.position}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
