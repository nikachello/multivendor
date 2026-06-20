import AnnouncementSection from "./AnnouncementSection";
import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import CollectionSection from "./CollectionSection";
import HighlightsSection from "./HighlightsSection";
import TestimonialsSection from "./TestimonialsSection";
import CategoriesSection from "./CategoriesSection";
import RichTextSection from "./RichTextSection";
import ImageTextSection from "./ImageTextSection";
import GallerySection from "./GallerySection";
import NewsletterSection from "./NewsletterSection";
import FaqSection from "./FaqSection";
import StatsSection from "./StatsSection";
import DividerSection from "./DividerSection";
import { ThemeDefinition } from "@/themes/types";

export const maisonTheme: ThemeDefinition = {
  id: "maison",
  name: "Maison",
  description: "Luxury editorial with Playfair Display headings and warm parchment tones",
  thumbnail: "/themes/maison-thumb.jpg",
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
