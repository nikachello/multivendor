import { ComponentType } from "react";
import { CSSProperties } from "react";
import { FieldDef } from "@/lib/editor-schema";

export type PageType = "home" | "collection" | "product" | "search";

// ─── Section metadata ────────────────────────────────────────────────────────
// Lives inside each theme's index.ts (not in a global registry).
// This is what the editor uses to render the Add panel and Settings panel.

export type SectionMeta = {
  type: string;
  label: string;
  description: string;
  /** Restrict to specific pages. Undefined = available on all pages. */
  pages?: PageType[];
  /** Field definitions for the right-hand settings panel. */
  fieldSchema: FieldDef[];
  /** Initial props when the section is first added. */
  defaultProps: Record<string, unknown>;
};

// ─── Section component registry ─────────────────────────────────────────────
// Open map: any string key → any component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionRegistry = Record<string, ComponentType<any>>;

// ─── Theme config ────────────────────────────────────────────────────────────

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

// ─── Theme definition ────────────────────────────────────────────────────────
// A theme is self-contained: sections + config + metadata for the editor.
// Adding a new theme = create this object and add one line to registry.ts.

export type ThemeDefinition = {
  id:          string;
  name:        string;
  description: string;
  thumbnail:   string;
  config:      ThemeConfig;
  /** type key → React component */
  sections:    SectionRegistry;
  /** All section definitions for this theme, including navbar. */
  sectionMeta: SectionMeta[];
};
