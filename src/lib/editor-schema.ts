import { ShopSection, SectionType } from "@/lib/types/store-section";

export type FlatFieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "color"; key: string; label: string }
  | { type: "image-upload"; key: string; label: string }
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
  | { type: "select-shop-categories"; key: string; label: string }
  | { type: "multiselect-shop-categories"; key: string; label: string };

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
  "before-after": "Before & After",
  ingredients: "Ingredients",
  reviews: "Reviews",
  "routine-builder": "Routine Builder",
  "shade-picker": "Shade Picker",
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
  { type: "before-after", description: "Interactive slider comparing two images — Dew theme" },
  { type: "ingredients", description: "Ingredient accordion with expand/collapse — Dew theme" },
  { type: "reviews", description: "Star-rated review cards — Dew theme" },
  { type: "routine-builder", description: "Bundle picker with live discount — Dew theme" },
  { type: "shade-picker", description: "Featured product with color swatches — Dew theme" },
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
  "before-after": {
    title: "Before & After",
    beforeLabel: "Before",
    afterLabel: "After",
  },
  ingredients: {
    title: "What's inside",
    subtitle: "Key ingredients",
    items: [
      { name: "Hyaluronic Acid", description: "Draws moisture into the skin for lasting hydration." },
      { name: "Niacinamide 5%", description: "Visibly minimises pores and evens skin tone over time." },
    ],
  },
  reviews: {
    title: "Loved by thousands",
    rating: "4.8",
    reviewCount: "2,400",
    items: [
      { quote: "My skin has never felt this good. I use it every morning.", author: "Sarah M." },
      { quote: "Gentle enough for sensitive skin. Absolutely love it.", author: "Priya K." },
      { quote: "The glow is real. I get compliments constantly.", author: "Jamie L." },
    ],
  },
  "routine-builder": {
    title: "Build your routine",
    subtitle: "Bundle 3+ and save 15%",
    discountPercent: 15,
    minItems: 3,
    items: [
      { name: "Gentle Gel Cleanser", step: "Step 1 — Cleanse", price: 24 },
      { name: "Barrier Serum", step: "Step 2 — Treat", price: 48 },
      { name: "Daily Glow SPF 50", step: "Step 3 — Protect", price: 32 },
      { name: "Overnight Mask", step: "Step 4 — Restore", price: 38 },
    ],
  },
  "shade-picker": {
    title: "Skin Tint SPF 30",
    subtitle: "bestseller",
    body: "A buildable, skin-perfecting tint with SPF 30. Lightweight. Breathable. Yours.",
    price: 36,
    shades: [
      { name: "Porcelain", color: "#F5E6D8" },
      { name: "Ivory", color: "#EEDAD0" },
      { name: "Sand", color: "#D4B896" },
      { name: "Caramel", color: "#B8885A" },
      { name: "Espresso", color: "#6B3E26" },
    ],
  },
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
    { type: "image-upload", key: "image", label: "Image" },
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
    { type: "multiselect-shop-categories", key: "categoryIds", label: "Show only these categories (leave empty for all)" },
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
        { type: "image-upload", key: "imageUrl", label: "Image" },
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
    { type: "image-upload", key: "image", label: "Image" },
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
        { type: "image-upload", key: "url", label: "Image" },
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
  "before-after": [
    { type: "text", key: "title", label: "Title", placeholder: "Before & After" },
    { type: "image-upload", key: "beforeImage", label: "Before image" },
    { type: "image-upload", key: "afterImage", label: "After image" },
    { type: "text", key: "beforeLabel", label: "Before label", placeholder: "Before" },
    { type: "text", key: "afterLabel", label: "After label", placeholder: "After" },
  ],
  ingredients: [
    { type: "text", key: "title", label: "Title", placeholder: "What's inside" },
    { type: "text", key: "subtitle", label: "Eyebrow", placeholder: "Key ingredients" },
    {
      type: "list",
      key: "items",
      label: "Ingredient",
      itemDefault: { name: "", description: "" },
      itemFields: [
        { type: "text", key: "name", label: "Name", placeholder: "Hyaluronic Acid" },
        { type: "textarea", key: "description", label: "Description", placeholder: "What it does..." },
      ],
    },
  ],
  reviews: [
    { type: "text", key: "title", label: "Title", placeholder: "Loved by thousands" },
    { type: "text", key: "rating", label: "Average rating", placeholder: "4.8" },
    { type: "text", key: "reviewCount", label: "Review count", placeholder: "2,400" },
    {
      type: "list",
      key: "items",
      label: "Review",
      itemDefault: { quote: "", author: "" },
      itemFields: [
        { type: "textarea", key: "quote", label: "Quote", placeholder: "This product changed my skin..." },
        { type: "text", key: "author", label: "Author", placeholder: "Sarah M." },
      ],
    },
  ],
  "routine-builder": [
    { type: "text", key: "title", label: "Title", placeholder: "Build your routine" },
    { type: "text", key: "subtitle", label: "Eyebrow", placeholder: "Bundle 3+ and save 15%" },
    {
      type: "list",
      key: "items",
      label: "Product",
      itemDefault: { name: "", step: "", price: 0 },
      itemFields: [
        { type: "text", key: "name", label: "Product name", placeholder: "Gentle Gel Cleanser" },
        { type: "text", key: "step", label: "Step label", placeholder: "Step 1 — Cleanse" },
        { type: "text", key: "price", label: "Price", placeholder: "24" },
        { type: "image-upload", key: "image", label: "Image" },
      ],
    },
  ],
  "shade-picker": [
    { type: "text", key: "title", label: "Product name", placeholder: "Skin Tint SPF 30" },
    { type: "text", key: "subtitle", label: "Eyebrow", placeholder: "bestseller" },
    { type: "textarea", key: "body", label: "Description", placeholder: "A buildable, skin-perfecting tint..." },
    { type: "text", key: "price", label: "Price", placeholder: "36" },
    { type: "image-upload", key: "image", label: "Product image" },
    {
      type: "list",
      key: "shades",
      label: "Shade",
      itemDefault: { name: "", color: "#F5E6D8" },
      itemFields: [
        { type: "text", key: "name", label: "Shade name", placeholder: "Porcelain" },
        { type: "color", key: "color", label: "Swatch color" },
      ],
    },
  ],
};
