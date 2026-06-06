import { Category, Pro, ShopTestimonial } from "./data-types";

export type SectionContext = {
  shopId?: string;
  currency?: string;
};

export type AnnouncementSectionProps = SectionContext & {
  text: string;
  bgColor?: string;
  textColor?: string;
  link?: string;
  linkText?: string;
};

export type NavbarSectionProps = SectionContext & {
  links?: { label: string; href: string }[];
  transparent?: boolean;
};

export type CollectionSectionProps = {
  categoryId: string;
};

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

export type CategoriesSectionProps = {
  title?: string;
  categoryIds: string[];
  columns?: 2 | 3 | 4 | 5 | 6;
  showProductCount?: boolean;
};
