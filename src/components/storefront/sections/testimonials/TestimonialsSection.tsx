import { Marquee } from "@/components/ui/marquee";
import { TestimonialsSectionProps } from "@/lib/types/sections";
import TestimonialCard from "./TestimonialCard";
import { getTestimonialsByShop } from "@/lib/db/queries";

const TestimonialsSection = async ({ shopId, variant = "marquee" }: TestimonialsSectionProps) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok) return null;

  const testimonials = result.data;

  if (variant === "grid") {
    return (
      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden py-2 pt-20">
      <Marquee pauseOnHover repeat={6} className="[--duration:30s]">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
};

export default TestimonialsSection;
