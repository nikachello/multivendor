import { Marquee } from "@/components/ui/marquee";
import TestimonialCard from "./Testimony";
import { Testimonial } from "@/generated/prisma/client";

type Props = {
  testimonials: Testimonial[];
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
