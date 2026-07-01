import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import HighlightsSection from "./HighlightsSection";
import ImageTextSection from "./ImageTextSection";
import AnnouncementSection from "@/themes/_shared/AnnouncementSection";
import RichTextSection from "@/themes/_shared/RichTextSection";
import CollectionSection from "@/themes/_shared/CollectionSection";
import CategoriesSection from "@/themes/_shared/CategoriesSection";
import TestimonialsSection from "@/themes/_shared/TestimonialsSection";
import ProductTestimonialsSection from "@/themes/_shared/ProductTestimonialsSection";
import GallerySection from "@/themes/_shared/GallerySection";
import NewsletterSection from "@/themes/_shared/NewsletterSection";
import FaqSection from "@/themes/_shared/FaqSection";
import StatsSection from "@/themes/_shared/StatsSection";
import DividerSection from "@/themes/_shared/DividerSection";
import BeforeAfterSection from "@/themes/dew/BeforeAfterSection";
import IngredientsSection from "@/themes/dew/IngredientsSection";
import ReviewsSection from "@/themes/dew/ReviewsSection";
import RoutineBuilderSection from "@/themes/dew/RoutineBuilderSection";
import ShadePickerSection from "@/themes/dew/ShadePickerSection";
import { ThemeDefinition } from "@/themes/types";

export const ecruTheme: ThemeDefinition = {
  id: "ecru",
  name: "Écru",
  description: "Editorial atelier aesthetic for fashion, lifestyle, and apparel brands",
  thumbnail: "/themes/ecru-thumb.jpg",
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
