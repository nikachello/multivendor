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
  BeforeAfterSectionProps,
  IngredientsSectionProps,
  ReviewsSectionProps,
  RoutineBuilderSectionProps,
  ShadePickerSectionProps,
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
  | { id: string; type: "divider"; props: DividerSectionProps }
  | { id: string; type: "before-after"; props: BeforeAfterSectionProps }
  | { id: string; type: "ingredients"; props: IngredientsSectionProps }
  | { id: string; type: "reviews"; props: ReviewsSectionProps }
  | { id: string; type: "routine-builder"; props: RoutineBuilderSectionProps }
  | { id: string; type: "shade-picker"; props: ShadePickerSectionProps };

export type SectionProps<T extends ShopSection["type"]> = Extract<
  ShopSection,
  { type: T }
>["props"];

export type SectionType = ShopSection["type"];
