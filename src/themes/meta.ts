export type ThemeMeta = {
  id: string;
  name: string;
  description: string;
  available: boolean;
};

export const THEMES_META: ThemeMeta[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, whitespace-first design with sharp typography",
    available: true,
  },
  {
    id: "maison",
    name: "Maison",
    description: "Luxury editorial with display headings and warm parchment tones",
    available: true,
  },
  {
    id: "dew",
    name: "Dew",
    description: "Soft beauty & wellness theme with periwinkle accents and warm blush tones",
    available: true,
  },
  {
    id: "pipeline",
    name: "Pipeline",
    description: "Editorial black & white with image rollover, portrait cards, and generous whitespace",
    available: true,
  },
  {
    id: "creator",
    name: "Creator",
    description: "Mobile-first bio link storefront for creators, coaches, and social-first shops",
    available: true,
  },
];
