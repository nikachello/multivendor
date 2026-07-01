import type { ThemeConfig } from "@/themes/types";
import type { TestimonialsSectionProps } from "@/lib/types/sections";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { Marquee } from "@/components/ui/marquee";

type Props = TestimonialsSectionProps & { themeConfig: ThemeConfig };

const Stars = () => (
  <span className="text-[var(--accent)] text-sm tracking-tight select-none">★★★★★</span>
);

const DewTestimonialCard = ({
  testimony,
  name,
  radius,
}: {
  testimony: string;
  name: string;
  radius: string;
}) => (
  <div
    className="w-72 flex-shrink-0 mx-3 bg-[var(--surface)] shadow-sm p-6 flex flex-col gap-3"
    style={{ borderRadius: radius }}
  >
    <Stars />
    <p className="text-sm text-neutral-600 italic leading-relaxed flex-1">{testimony}</p>
    <p className="text-xs font-medium text-[var(--primary)]">{name}</p>
  </div>
);

const TestimonialsSection = async ({ shopId, variant = "grid", themeConfig }: Props) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok) return null;

  const testimonials = result.data.filter((t) => !t.productId && t.isActive);
  if (!testimonials.length) return null;

  const radius = "var(--radius)";

  if (variant === "marquee") {
    return (
      <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)] overflow-hidden`}>
        <Marquee pauseOnHover repeat={6} className="[--duration:35s]">
          {testimonials.map((t) => (
            <DewTestimonialCard
              key={t.id}
              testimony={t.testimony}
              name={t.name}
              radius={radius}
            />
          ))}
        </Marquee>
      </section>
    );
  }

  // GRID: rounded cards, star ratings, soft bg
  return (
    <section className={`${themeConfig.layout.sectionPy} bg-[var(--page-bg)]`}>
      <div className={`${themeConfig.layout.contentPx} grid grid-cols-1 md:grid-cols-3 gap-5`}>
        {testimonials.slice(0, 3).map((t) => (
          <div
            key={t.id}
            className="bg-[var(--surface)] shadow-sm p-6 flex flex-col gap-3"
            style={{ borderRadius: radius }}
          >
            <Stars />
            <p className="text-sm text-neutral-600 italic leading-relaxed flex-1">{t.testimony}</p>
            <div>
              <p className="text-xs font-medium text-[var(--primary)]">{t.name}</p>
              {t.position && (
                <p className="text-xs text-[var(--muted)] mt-0.5">{t.position}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
