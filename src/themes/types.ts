import { ComponentType } from "react";
import { CSSProperties } from "react";
import { SectionProps, SectionType } from "@/lib/types/store-section";

export interface ThemeConfig {
  palette: {
    accent:  string;
    muted:   string;
    subtle:  string;
    surface: string;
  };

  type: {
    sectionHeading: string;
    cardHeading:    string;
    body:           string;
    label:          string;
    price:          string;
    display:        string;
    displayFont:    string;
  };

  layout: {
    sectionPy:       string;
    contentPx:       string;
    gridGap:         string;
    productGridCols: string;
    headingAlign:    "left" | "center";
  };

  components: {
    button: {
      className: string;
      style?:    CSSProperties;
    };
    input:   string;
    divider: string;
    productImage: {
      bg:          string;
      aspectRatio: string;
    };
  };

  sections: {
    announcement: {
      wrapper: string;
    };
    newsletter: {
      wrapper:     string;
      inputStyle:  CSSProperties;
      buttonStyle: CSSProperties;
    };
    testimonial: {
      quoteVisible: boolean;
      quoteClass:   string;
    };
    categories: {
      aspectRatio: string;
    };
    highlights: {
      variant: "divided" | "cards";
    };
  };

  defaults: {
    primaryColor:   string;
    secondaryColor: string;
    pageBackground: string;
    borderRadius:   string;
    fontFamily:     string;
  };

  extras?: Record<string, string>;
}

export type SectionRegistry = {
  [T in SectionType]?: ComponentType<SectionProps<T> & { themeConfig: ThemeConfig }>;
};

export type PageType = "home" | "collection" | "product" | "search";

export type ThemeDefinition = {
  id:          string;
  name:        string;
  description: string;
  thumbnail:   string;
  sections:    SectionRegistry;
};
