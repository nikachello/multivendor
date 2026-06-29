import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import AnnouncementSection from "@/themes/_shared/AnnouncementSection";
import RichTextSection from "@/themes/_shared/RichTextSection";
import HighlightsSection from "@/themes/_shared/HighlightsSection";
import CollectionSection from "@/themes/_shared/CollectionSection";
import CategoriesSection from "@/themes/_shared/CategoriesSection";
import TestimonialsSection from "@/themes/_shared/TestimonialsSection";
import ImageTextSection from "@/themes/_shared/ImageTextSection";
import GallerySection from "@/themes/_shared/GallerySection";
import NewsletterSection from "@/themes/_shared/NewsletterSection";
import FaqSection from "@/themes/_shared/FaqSection";
import StatsSection from "@/themes/_shared/StatsSection";
import DividerSection from "@/themes/_shared/DividerSection";
import { ThemeDefinition } from "@/themes/types";

export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  name: "Minimal",
  description: "Clean, typography-first design with generous whitespace",
  thumbnail: "/themes/minimal-thumb.jpg",
  sections: {
    announcement: AnnouncementSection,
    navbar: NavbarSection,
    banner: BannerSection,
    collection: CollectionSection,
    categories: CategoriesSection,
    highlights: HighlightsSection,
    testimonials: TestimonialsSection,
    "rich-text": RichTextSection,
    "image-text": ImageTextSection,
    gallery: GallerySection,
    newsletter: NewsletterSection,
    faq: FaqSection,
    stats: StatsSection,
    divider: DividerSection,
  },
};
