import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import BeforeAfterSection from "./BeforeAfterSection";
import IngredientsSection from "./IngredientsSection";
import ReviewsSection from "./ReviewsSection";
import RoutineBuilderSection from "./RoutineBuilderSection";
import ShadePickerSection from "./ShadePickerSection";
import CollectionSection from "./CollectionSection";
import CategoriesSection from "./CategoriesSection";
import HighlightsSection from "./HighlightsSection";
import TestimonialsSection from "./TestimonialsSection";
import RichTextSection from "./RichTextSection";
import ImageTextSection from "./ImageTextSection";
import GallerySection from "./GallerySection";
import NewsletterSection from "./NewsletterSection";
import FaqSection from "./FaqSection";
import StatsSection from "./StatsSection";
import AnnouncementSection from "@/themes/_shared/AnnouncementSection";
import DividerSection from "@/themes/_shared/DividerSection";
import ProductTestimonialsSection from "@/themes/_shared/ProductTestimonialsSection";
import { standardSectionMeta, dewSectionMeta } from "@/themes/_shared/sectionMeta";
import { dewConfig } from "./config";
import { ThemeDefinition } from "@/themes/types";

export const dewTheme: ThemeDefinition = {
  id: "dew",
  name: "Dew",
  description: "Soft, rounded beauty & wellness theme with periwinkle accents and warm blush tones",
  thumbnail: "/themes/dew-thumb.jpg",
  config: dewConfig,
  sections: {
    announcement: AnnouncementSection,
    navbar: NavbarSection,
    banner: BannerSection,
    collection: CollectionSection,
    categories: CategoriesSection,
    highlights: HighlightsSection,
    testimonials: TestimonialsSection,
    "product-testimonials": ProductTestimonialsSection,
    "rich-text": RichTextSection,
    "image-text": ImageTextSection,
    gallery: GallerySection,
    newsletter: NewsletterSection,
    faq: FaqSection,
    stats: StatsSection,
    divider: DividerSection,
    "before-after": BeforeAfterSection,
    ingredients: IngredientsSection,
    reviews: ReviewsSection,
    "routine-builder": RoutineBuilderSection,
    "shade-picker": ShadePickerSection,
  },
  sectionMeta: [...standardSectionMeta, ...dewSectionMeta],
};
