import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
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
import { standardSectionMeta } from "@/themes/_shared/sectionMeta";
import { maisonConfig } from "./config";
import { ThemeDefinition } from "@/themes/types";

export const maisonTheme: ThemeDefinition = {
  id: "maison",
  name: "Maison",
  description: "Luxury editorial with Playfair Display headings and warm parchment tones",
  thumbnail: "/themes/maison-thumb.jpg",
  config: maisonConfig,
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
  },
  sectionMeta: standardSectionMeta,
};
