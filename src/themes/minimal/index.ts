import AnnouncementSection from "@/components/storefront/sections/announcement/AnnouncementSection";
import NavbarSection from "@/components/storefront/sections/navbar/NavbarSection";
import BannerSection from "@/components/storefront/sections/banner/BannerSection";
import CollectionSection from "@/components/storefront/sections/collection/CollectionSection";
import HighlightsSection from "@/components/storefront/sections/highlights/HighlightsSection";
import TestimonialsSection from "@/components/storefront/sections/testimonials/TestimonialsSection";
import CategoriesSection from "@/components/storefront/sections/categories/CategoriesSection";
import RichTextSection from "@/components/storefront/sections/rich-text/RichTextSection";
import ImageTextSection from "@/components/storefront/sections/image-text/ImageTextSection";
import GallerySection from "@/components/storefront/sections/gallery/GallerySection";
import NewsletterSection from "@/components/storefront/sections/newsletter/NewsletterSection";
import FaqSection from "@/components/storefront/sections/faq/FaqSection";
import StatsSection from "@/components/storefront/sections/stats/StatsSection";
import DividerSection from "@/components/storefront/sections/divider/DividerSection";
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
