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
    id: "bold",
    name: "Bold",
    description: "High-contrast editorial look with dramatic sections",
    available: false,
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "Multi-column, content-dense layout for busy catalogues",
    available: false,
  },
  {
    id: "soft",
    name: "Soft",
    description: "Rounded corners, warm tones, and gentle gradients",
    available: false,
  },
];
