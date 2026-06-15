import { ShopSection, SectionType } from "@/lib/types/store-section";

export type FlatFieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "color"; key: string; label: string }
  | {
      type: "select";
      key: string;
      label: string;
      options: { value: string | number; label: string }[];
    };

export type FieldDef =
  | FlatFieldDef
  | {
      type: "list";
      key: string;
      label: string;
      itemFields: FlatFieldDef[];
      itemDefault: Record<string, unknown>;
    }
  | { type: "select-shop-categories"; key: string; label: string };

export const sectionLabels: Record<SectionType, string> = {
  announcement: "Announcement Bar",
  navbar: "Navbar",
  banner: "Banner",
  categories: "Categories",
  collection: "Collection",
  highlights: "Highlights",
  testimonials: "Testimonials",
  "rich-text": "Rich Text",
  "image-text": "Image + Text",
  gallery: "Gallery",
  newsletter: "Newsletter",
  faq: "FAQ",
  stats: "Stats",
  divider: "Divider",
};

type AddableSection = Exclude<ShopSection, { type: "navbar" }>;
export type AddableSectionType = AddableSection["type"];

export const addableSections: { type: AddableSectionType; description: string }[] = [
  { type: "announcement", description: "Top bar with a short message or promo" },
  { type: "banner", description: "Full-width hero image with headline" },
  { type: "categories", description: "Grid of shop categories" },
  { type: "collection", description: "Product grid from a category" },
  { type: "highlights", description: "Highlight key selling points or brand values" },
  { type: "testimonials", description: "Customer review cards" },
  { type: "rich-text", description: "Heading and body text with optional CTA" },
  { type: "image-text", description: "Image beside a text block" },
  { type: "gallery", description: "Grid of lifestyle images" },
  { type: "newsletter", description: "Email signup form" },
  { type: "faq", description: "Expandable questions and answers" },
  { type: "stats", description: "Key numbers and highlights" },
  { type: "divider", description: "Vertical spacing between sections" },
];

export const sectionDefaults: Record<AddableSectionType, AddableSection["props"]> = {
  announcement: {
    text: "Free shipping on orders over $50",
  },
  banner: {
    title: "New Arrivals",
    subtitle: "Discover our latest collection",
    image: "/banner.jpg",
    buttonText: "Shop Now",
    href: "/",
    variant: "cover",
  },
  categories: { title: "Shop by Category", categoryIds: [], columns: 4, variant: "grid" },
  collection: { categoryId: "", variant: "grid" },
  highlights: { items: [], variant: "cards" },
  testimonials: { variant: "marquee" },
  "rich-text": {
    title: "Our Story",
    body: "Write something about your brand here.",
    align: "center",
  },
  "image-text": {
    image: "/banner.jpg",
    title: "Built with purpose",
    body: "Tell the story behind this product or feature.",
    imagePosition: "left",
  },
  gallery: { images: [], columns: 3 },
  newsletter: {
    title: "Stay in the loop",
    subtitle: "Get updates on new arrivals and exclusive offers.",
    buttonText: "Subscribe",
    variant: "banner",
  },
  faq: { title: "Frequently Asked Questions", items: [] },
  stats: { stats: [] },
  divider: { spacing: "md" },
};

export const sectionFieldSchema: Partial<Record<SectionType, FieldDef[]>> = {
  announcement: [
    { type: "text", key: "text", label: "Text", placeholder: "Free shipping on orders over $50" },
    { type: "text", key: "link", label: "Link URL", placeholder: "/collections/all" },
    { type: "text", key: "linkText", label: "Link Text", placeholder: "Shop now" },
  ],
  banner: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "cover", label: "Full cover" },
        { value: "split", label: "Split (image + text)" },
        { value: "compact", label: "Compact" },
      ],
    },
    { type: "text", key: "title", label: "Title", placeholder: "New arrivals" },
    { type: "text", key: "subtitle", label: "Subtitle", placeholder: "Discover our latest collection" },
    { type: "text", key: "image", label: "Image URL", placeholder: "/banner.jpg" },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop now" },
    { type: "text", key: "href", label: "Button link", placeholder: "/" },
  ],
  categories: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "grid", label: "Grid" },
        { value: "large", label: "Large cards" },
        { value: "pills", label: "Pills" },
      ],
    },
    { type: "text", key: "title", label: "Section title", placeholder: "Shop by Category" },
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) })),
    },
  ],
  collection: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "grid", label: "Grid" },
        { value: "featured", label: "Featured" },
        { value: "list", label: "List" },
      ],
    },
    { type: "select-shop-categories", key: "categoryId", label: "Category" },
  ],
  highlights: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "cards", label: "Cards" },
        { value: "icons-row", label: "Icons row" },
        { value: "numbered", label: "Numbered" },
      ],
    },
    {
      type: "list",
      key: "items",
      label: "Highlight",
      itemDefault: { type: "text", title: "", description: "", imageUrl: "", buttonText: "", buttonUrl: "" },
      itemFields: [
        {
          type: "select",
          key: "type",
          label: "Style",
          options: [
            { value: "text", label: "Text card" },
            { value: "image", label: "Image card" },
          ],
        },
        { type: "text", key: "title", label: "Title", placeholder: "Free shipping" },
        { type: "textarea", key: "description", label: "Description", placeholder: "On all orders over $50" },
        { type: "text", key: "imageUrl", label: "Image URL", placeholder: "/feature.jpg" },
        { type: "text", key: "buttonText", label: "Button text", placeholder: "Learn more" },
        { type: "text", key: "buttonUrl", label: "Button URL", placeholder: "/policies/shipping" },
      ],
    },
  ],
  testimonials: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "marquee", label: "Marquee" },
        { value: "grid", label: "Grid" },
      ],
    },
  ],
  "rich-text": [
    {
      type: "select",
      key: "align",
      label: "Alignment",
      options: [
        { value: "center", label: "Center" },
        { value: "left", label: "Left" },
      ],
    },
    { type: "text", key: "title", label: "Title", placeholder: "Our Story" },
    { type: "textarea", key: "body", label: "Body", placeholder: "Write something here..." },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Learn more" },
    { type: "text", key: "buttonHref", label: "Button link", placeholder: "/about" },
  ],
  "image-text": [
    {
      type: "select",
      key: "imagePosition",
      label: "Image side",
      options: [
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ],
    },
    { type: "text", key: "image", label: "Image URL", placeholder: "/image.jpg" },
    { type: "text", key: "title", label: "Title", placeholder: "Built with purpose" },
    { type: "textarea", key: "body", label: "Body", placeholder: "Tell your story..." },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Learn more" },
    { type: "text", key: "buttonHref", label: "Button link", placeholder: "/" },
  ],
  gallery: [
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [2, 3, 4].map((n) => ({ value: n, label: String(n) })),
    },
    {
      type: "list",
      key: "images",
      label: "Image",
      itemDefault: { url: "", alt: "" },
      itemFields: [
        { type: "text", key: "url", label: "Image URL", placeholder: "https://..." },
        { type: "text", key: "alt", label: "Alt text", placeholder: "Description" },
      ],
    },
  ],
  newsletter: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "banner", label: "Full banner" },
        { value: "minimal", label: "Minimal" },
      ],
    },
    { type: "text", key: "title", label: "Title", placeholder: "Stay in the loop" },
    { type: "text", key: "subtitle", label: "Subtitle", placeholder: "Get updates on new arrivals" },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Subscribe" },
  ],
  faq: [
    { type: "text", key: "title", label: "Section title", placeholder: "Frequently Asked Questions" },
    {
      type: "list",
      key: "items",
      label: "Question",
      itemDefault: { question: "", answer: "" },
      itemFields: [
        { type: "text", key: "question", label: "Question", placeholder: "How does shipping work?" },
        { type: "textarea", key: "answer", label: "Answer", placeholder: "We ship within 2-3 business days..." },
      ],
    },
  ],
  stats: [
    {
      type: "list",
      key: "stats",
      label: "Stat",
      itemDefault: { value: "", label: "" },
      itemFields: [
        { type: "text", key: "value", label: "Value", placeholder: "10k+" },
        { type: "text", key: "label", label: "Label", placeholder: "Happy customers" },
      ],
    },
  ],
  divider: [
    {
      type: "select",
      key: "spacing",
      label: "Spacing",
      options: [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
    },
  ],
};
