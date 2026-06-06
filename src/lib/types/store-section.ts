import {
  AnnouncementSectionProps,
  BannerSectionProps,
  CategoriesSectionProps,
  CollectionSectionProps,
  NavbarSectionProps,
  ProsSectionProps,
  TestimonialsSectionProps,
} from "./sections";

export type ShopSection =
  | { id: string; type: "announcement"; props: AnnouncementSectionProps }
  | { id: string; type: "navbar"; props: NavbarSectionProps }
  | {
      id: string;
      type: "banner";
      props: BannerSectionProps;
    }
  | { id: string; type: "pros"; props: ProsSectionProps }
  | { id: string; type: "collection"; props: CollectionSectionProps }
  | {
      id: string;
      type: "testimonials";
      props: TestimonialsSectionProps;
    }
  | {
      id: string;
      type: "categories";
      props: CategoriesSectionProps;
    };

export type SectionProps<T extends ShopSection["type"]> = Extract<
  ShopSection,
  { type: T }
>["props"];

export type SectionType = ShopSection["type"];
