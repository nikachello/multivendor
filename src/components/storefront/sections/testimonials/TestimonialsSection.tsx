import { Marquee } from "@/components/ui/marquee";
import { TestimonialsSectionProps } from "@/lib/types/sections";
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => {
  return (
    <section className="overflow-hidden py-2 pt-20">
      <Marquee pauseOnHover repeat={6} className="[--duration:30s]">
        {testimonials.map((testimonial, id) => (
          <TestimonialCard key={id} testimonial={testimonial} />
        ))}
      </Marquee>
    </section>
  );
};

export default TestimonialsSection;
