import { Pro, ShopTestimonial } from "@/lib/types";

export type BannerSectionProps = {
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  href?: string;
};

export type ProsSectionProps = {
  pros: Pro[];
};

export type TestimonialsSectionProps = {
  testimonials: ShopTestimonial[];
};
