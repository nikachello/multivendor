import { Marquee } from "@/components/ui/marquee";
import { TestimonialsSectionProps } from "@/lib/types/sections";
import TestimonialCard from "./TestimonialCard";
import { getTestimonialsByShop } from "@/lib/db/queries";

const TestimonialsSection = async ({ shopId }: TestimonialsSectionProps) => {
  if (!shopId) return null;

  const result = await getTestimonialsByShop(shopId);
  if (!result.ok) return null;

  return (
    <section className="overflow-hidden py-2 pt-20">
      <Marquee pauseOnHover repeat={6} className="[--duration:30s]">
        {result.data.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
};

export default TestimonialsSection;
