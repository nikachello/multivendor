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
    description: "Luxury editorial with Playfair Display headings and warm parchment tones",
    available: true,
  },
  {
    id: "solo",
    name: "Solo",
    description: "Warm amber tones for lifestyle and artisan brands",
    available: true,
  },
  {
    id: "market",
    name: "Market",
    description: "Fresh green palette for grocery and marketplace shops",
    available: true,
  },
  {
    id: "forma",
    name: "Forma",
    description: "High-contrast dark theme for streetwear and bold apparel",
    available: true,
  },
  {
    id: "roaster",
    name: "Roaster",
    description: "Warm café aesthetic for coffee and artisan product shops",
    available: true,
  },
  {
    id: "ecru",
    name: "Écru",
    description: "Editorial atelier aesthetic for fashion, lifestyle, and apparel brands",
    available: true,
  },
  {
    id: "dew",
    name: "Dew",
    description: "Soft beauty & wellness theme with periwinkle accents and warm blush tones",
    available: true,
  },
];
