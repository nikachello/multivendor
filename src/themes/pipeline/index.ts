import NavbarSection from "./NavbarSection";
import BannerSection from "./BannerSection";
import CollectionSection from "./CollectionSection";
import FeaturedProductSection from "./FeaturedProductSection";
import CategoriesSection from "./CategoriesSection";
import HighlightsSection from "./HighlightsSection";
import TestimonialsSection from "./TestimonialsSection";
import RichTextSection from "./RichTextSection";
import ImageTextSection from "./ImageTextSection";
import ImageBannerSection from "./ImageBannerSection";
import MultiColumnSection from "./MultiColumnSection";
import CountdownSection from "./CountdownSection";
import LogoListSection from "./LogoListSection";
import CollageSection from "./CollageSection";
import GallerySection from "./GallerySection";
import NewsletterSection from "./NewsletterSection";
import FaqSection from "./FaqSection";
import StatsSection from "./StatsSection";
import AnnouncementSection from "@/themes/_shared/AnnouncementSection";
import DividerSection from "@/themes/_shared/DividerSection";
import ProductTestimonialsSection from "@/themes/_shared/ProductTestimonialsSection";
import { pipelineConfig } from "./config";
import { pipelineSectionMeta } from "./sectionMeta";
import { ThemeDefinition } from "@/themes/types";

export const pipelineTheme: ThemeDefinition = {
  id: "pipeline",
  name: "Pipeline",
  description: "Editorial black & white with image rollover, portrait cards, and generous whitespace",
  thumbnail: "/themes/pipeline-thumb.jpg",
  config: pipelineConfig,
  sections: {
    announcement: AnnouncementSection,
    navbar: NavbarSection,
    banner: BannerSection,
    collection: CollectionSection,
    "featured-product": FeaturedProductSection,
    categories: CategoriesSection,
    "image-banner": ImageBannerSection,
    "multi-column": MultiColumnSection,
    collage: CollageSection,
    highlights: HighlightsSection,
    "image-text": ImageTextSection,
    "rich-text": RichTextSection,
    testimonials: TestimonialsSection,
    "product-testimonials": ProductTestimonialsSection,
    gallery: GallerySection,
    countdown: CountdownSection,
    "logo-list": LogoListSection,
    newsletter: NewsletterSection,
    faq: FaqSection,
    stats: StatsSection,
    divider: DividerSection,
  },
  sectionMeta: pipelineSectionMeta,
};
