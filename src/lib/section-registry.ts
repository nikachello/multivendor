import AnnouncementSection from "@/components/storefront/sections/announcement/AnnouncementSection";
import NavbarSection from "@/components/storefront/sections/navbar/NavbarSection";
import BannerSection from "@/components/storefront/sections/banner/BannerSection";
import CollectionSection from "@/components/storefront/sections/collection/CollectionSection";
import ProsSection from "@/components/storefront/sections/pros/ProsSection";
import TestimonialsSection from "@/components/storefront/sections/testimonials/TestimonialsSection";
import { ShopSection, SectionProps } from "@/lib/types/store-section";
import { ComponentType } from "react";
import CategoriesSection from "@/components/storefront/sections/categories/CategoriesSection";

type SectionRegistry = {
  [T in ShopSection["type"]]: ComponentType<SectionProps<T>>;
};

export const sectionRegistry: SectionRegistry = {
  announcement: AnnouncementSection,
  navbar: NavbarSection,
  banner: BannerSection,
  collection: CollectionSection,
  categories: CategoriesSection,
  pros: ProsSection,
  testimonials: TestimonialsSection,
};
