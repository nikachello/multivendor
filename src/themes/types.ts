import { ComponentType } from "react";
import { SectionProps, SectionType } from "@/lib/types/store-section";

export type SectionRegistry = {
  [T in SectionType]: ComponentType<SectionProps<T>>;
};

export type PageType = "home" | "collection" | "product" | "search";

export type ThemeDefinition = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  sections: SectionRegistry;
};
