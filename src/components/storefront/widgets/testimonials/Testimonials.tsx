import { Marquee } from "@/components/ui/marquee";
import { ShopTestimonial } from "@/lib/types";
import React from "react";
import Testimony from "./Testimony";
import TestimonialCard from "./Testimony";

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
