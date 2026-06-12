import {
  AnnouncementSectionProps,
  BannerSectionProps,
  CategoriesSectionProps,
  CollectionSectionProps,
  NavbarSectionProps,
  HighlightsSectionProps,
  TestimonialsSectionProps,
  RichTextSectionProps,
  ImageTextSectionProps,
  GallerySectionProps,
  NewsletterSectionProps,
  FaqSectionProps,
  StatsSectionProps,
  DividerSectionProps,
} from "./sections";

export type ShopSection =
  | { id: string; type: "announcement"; props: AnnouncementSectionProps }
  | { id: string; type: "navbar"; props: NavbarSectionProps }
  | { id: string; type: "banner"; props: BannerSectionProps }
  | { id: string; type: "highlights"; props: HighlightsSectionProps }
  | { id: string; type: "collection"; props: CollectionSectionProps }
  | { id: string; type: "testimonials"; props: TestimonialsSectionProps }
  | { id: string; type: "categories"; props: CategoriesSectionProps }
  | { id: string; type: "rich-text"; props: RichTextSectionProps }
  | { id: string; type: "image-text"; props: ImageTextSectionProps }
  | { id: string; type: "gallery"; props: GallerySectionProps }
  | { id: string; type: "newsletter"; props: NewsletterSectionProps }
  | { id: string; type: "faq"; props: FaqSectionProps }
  | { id: string; type: "stats"; props: StatsSectionProps }
  | { id: string; type: "divider"; props: DividerSectionProps };

export type SectionProps<T extends ShopSection["type"]> = Extract<
  ShopSection,
  { type: T }
>["props"];

export type SectionType = ShopSection["type"];
