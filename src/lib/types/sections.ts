import { Highlight } from "./data-types";

export type SectionContext = {
  shopId?: string;
  shopSlug?: string;
  shopName?: string;
  currency?: string;
};

export type AnnouncementSectionProps = SectionContext & {
  text: string;
  link?: string;
  linkText?: string;
};

export type NavbarSectionProps = SectionContext & {
  items?: NavItem[];
  transparent?: boolean;
};

export type NavItem =
  | { id: string; type: "link"; label: string; href: string }
  | { id: string; type: "group"; label: string; children: NavItem[] };

export type CollectionSectionProps = {
  categoryId: string;
  variant?: "grid" | "featured" | "list";
};

export type BannerSectionProps = {
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  href?: string;
  variant?: "cover" | "split" | "compact";
};

export type HighlightsSectionProps = {
  items: Highlight[];
  variant?: "cards" | "icons-row" | "numbered";
};

export type TestimonialsSectionProps = SectionContext & {
  variant?: "marquee" | "grid";
};

export type CategoriesSectionProps = {
  title?: string;
  categoryIds: string[];
  columns?: 2 | 3 | 4 | 5 | 6;
  showProductCount?: boolean;
  variant?: "grid" | "large" | "pills";
};

export type RichTextSectionProps = {
  title?: string;
  body?: string;
  align?: "left" | "center";
  buttonText?: string;
  buttonHref?: string;
};

export type ImageTextSectionProps = {
  image?: string;
  title?: string;
  body?: string;
  buttonText?: string;
  buttonHref?: string;
  imagePosition?: "left" | "right";
};

export type GallerySectionProps = {
  images?: { url: string; alt?: string }[];
  columns?: 2 | 3 | 4;
};

export type NewsletterSectionProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: "banner" | "minimal";
};

export type FaqSectionProps = {
  title?: string;
  items?: { question: string; answer: string }[];
};

export type StatsSectionProps = {
  stats?: { value: string; label: string }[];
};

export type DividerSectionProps = {
  spacing?: "sm" | "md" | "lg";
};

// Legacy alias
export type ProsSectionProps = HighlightsSectionProps;
