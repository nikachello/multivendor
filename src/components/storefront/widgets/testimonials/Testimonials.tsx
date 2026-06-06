import { Marquee } from "@/components/ui/marquee";
import TestimonialCard from "./Testimony";
import { ShopTestimonial } from "@/lib/types/data-types";

type Props = {
  testimonials: ShopTestimonial[];
};

const Testimonials = ({ testimonials }: Props) => {
  return (
    <div>
      <Marquee pauseOnHover className="[--duration:30s]">
        {testimonials.map((testimonial, id) => (
          <div key={id}>
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Testimonials;
