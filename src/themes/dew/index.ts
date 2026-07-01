import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import BeforeAfterSection from "./BeforeAfterSection";
import IngredientsSection from "./IngredientsSection";
import ReviewsSection from "./ReviewsSection";
import RoutineBuilderSection from "./RoutineBuilderSection";
import ShadePickerSection from "./ShadePickerSection";
import AnnouncementSection from "@/themes/_shared/AnnouncementSection";
import CollectionSection from "@/themes/_shared/CollectionSection";
import CategoriesSection from "@/themes/_shared/CategoriesSection";
import HighlightsSection from "@/themes/_shared/HighlightsSection";
import TestimonialsSection from "@/themes/_shared/TestimonialsSection";
import ProductTestimonialsSection from "@/themes/_shared/ProductTestimonialsSection";
import RichTextSection from "@/themes/_shared/RichTextSection";
import ImageTextSection from "@/themes/_shared/ImageTextSection";
import GallerySection from "@/themes/_shared/GallerySection";
import NewsletterSection from "@/themes/_shared/NewsletterSection";
import FaqSection from "@/themes/_shared/FaqSection";
import StatsSection from "@/themes/_shared/StatsSection";
import DividerSection from "@/themes/_shared/DividerSection";
import { ThemeDefinition } from "@/themes/types";

export const dewTheme: ThemeDefinition = {
  id: "dew",
  name: "Dew",
  description: "Soft, rounded beauty & wellness theme with periwinkle accents and warm blush tones",
  thumbnail: "/themes/dew-thumb.jpg",
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
};
