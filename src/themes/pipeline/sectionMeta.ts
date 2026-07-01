import type { SectionMeta } from "@/themes/types";
import {
  navbarMeta,
  announcementMeta,
  testimonialsMeta,
  productTestimonialsMeta,
  galleryMeta,
  newsletterMeta,
  faqMeta,
  statsMeta,
  dividerMeta,
  imageTextMeta,
  richTextMeta,
  highlightsMeta,
} from "@/themes/_shared/sectionMeta";

const bannerMeta: SectionMeta = {
  type: "banner",
  label: "Hero Banner",
  description: "Full-screen hero with image and headline",
  fieldSchema: [
    {
      type: "select",
      key: "contentPosition",
      label: "Text position",
      options: [
        { value: "bottom-left", label: "Bottom left" },
        { value: "bottom-center", label: "Bottom center" },
        { value: "center", label: "Center" },
        { value: "center-left", label: "Center left" },
      ],
    },
    {
      type: "select",
      key: "height",
      label: "Height",
      options: [
        { value: "full", label: "Full screen" },
        { value: "large", label: "Large (80vh)" },
        { value: "medium", label: "Medium (55vh)" },
      ],
    },
    { type: "text", key: "title", label: "Headline", placeholder: "New season arrivals" },
    { type: "text", key: "subtitle", label: "Eyebrow text", placeholder: "Spring / Summer 2025" },
    { type: "image-upload", key: "image", label: "Background image" },
    {
      type: "select",
      key: "overlayOpacity",
      label: "Overlay darkness",
      options: [
        { value: 0, label: "None" },
        { value: 20, label: "Light" },
        { value: 35, label: "Medium" },
        { value: 55, label: "Dark" },
        { value: 70, label: "Very dark" },
      ],
    },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop now" },
    { type: "text", key: "href", label: "Button link", placeholder: "/" },
  ],
  defaultProps: {
    title: "New Season Arrivals",
    subtitle: "Spring / Summer 2025",
    image: "/banner.jpg",
    buttonText: "Explore Collection",
    href: "/",
    contentPosition: "bottom-left",
    overlayOpacity: 35,
    height: "full",
  },
};

const collectionMeta: SectionMeta = {
  type: "collection",
  label: "Collection",
  description: "Product grid with image rollover on hover",
  pages: ["home", "collection", "search"],
  fieldSchema: [
    { type: "select-shop-categories", key: "categoryId", label: "Category" },
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
      ],
    },
    {
      type: "select",
      key: "limit",
      label: "Max products",
      options: [
        { value: 4, label: "4" },
        { value: 6, label: "6" },
        { value: 8, label: "8" },
        { value: 12, label: "12" },
      ],
    },
  ],
  defaultProps: { categoryId: "", columns: 4, showViewAll: true },
};

const featuredProductMeta: SectionMeta = {
  type: "featured-product",
  label: "Featured Product",
  description: "Large single-product spotlight",
  pages: ["home", "collection"],
  fieldSchema: [
    { type: "select-shop-categories", key: "categoryId", label: "Category (first product shown)" },
    { type: "text", key: "overlineText", label: "Overline", placeholder: "Featured" },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop Now" },
  ],
  defaultProps: { overlineText: "Featured", buttonText: "Shop Now" },
};

const imageBannerMeta: SectionMeta = {
  type: "image-banner",
  label: "Image Banner",
  description: "Full-width image with overlay text",
  fieldSchema: [
    { type: "image-upload", key: "image", label: "Image" },
    { type: "text", key: "title", label: "Title", placeholder: "Our Story" },
    { type: "text", key: "subtitle", label: "Eyebrow", placeholder: "Since 2020" },
    {
      type: "select",
      key: "contentPosition",
      label: "Content position",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    {
      type: "select",
      key: "overlayOpacity",
      label: "Overlay darkness",
      options: [
        { value: 0, label: "None" },
        { value: 20, label: "Light" },
        { value: 30, label: "Medium" },
        { value: 50, label: "Dark" },
      ],
    },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Learn more" },
    { type: "text", key: "href", label: "Button link", placeholder: "/" },
  ],
  defaultProps: {
    title: "Our Story",
    contentPosition: "center",
    overlayOpacity: 30,
  },
};

const multiColumnMeta: SectionMeta = {
  type: "multi-column",
  label: "Multi-Column",
  description: "Side-by-side text or image+text columns",
  fieldSchema: [
    { type: "text", key: "title", label: "Section label", placeholder: "Why us" },
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [
        { value: 2, label: "2 columns" },
        { value: 3, label: "3 columns" },
        { value: 4, label: "4 columns" },
      ],
    },
    {
      type: "list",
      key: "items",
      label: "Column",
      itemDefault: { image: "", title: "", text: "", buttonText: "", buttonUrl: "" },
      itemFields: [
        { type: "image-upload", key: "image", label: "Image (optional)" },
        { type: "text", key: "title", label: "Title", placeholder: "Free returns" },
        { type: "textarea", key: "text", label: "Text", placeholder: "Returns made easy..." },
        { type: "text", key: "buttonText", label: "Button text", placeholder: "Learn more" },
        { type: "text", key: "buttonUrl", label: "Button link", placeholder: "/" },
      ],
    },
  ],
  defaultProps: {
    columns: 3,
    items: [
      { title: "Free shipping", text: "On all orders over $50. Fast and reliable delivery." },
      { title: "Easy returns", text: "30-day hassle-free returns. No questions asked." },
      { title: "Secure checkout", text: "Your payment information is always protected." },
    ],
  },
};

const countdownMeta: SectionMeta = {
  type: "countdown",
  label: "Countdown Timer",
  description: "Sale or event countdown with urgency",
  fieldSchema: [
    { type: "text", key: "title", label: "Title", placeholder: "Limited Time Offer" },
    { type: "text", key: "subtitle", label: "Eyebrow", placeholder: "Sale ends in" },
    { type: "text", key: "endDate", label: "End date & time", placeholder: "2025-12-31T23:59:59" },
    {
      type: "select",
      key: "background",
      label: "Background",
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
      ],
    },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop the sale" },
    { type: "text", key: "buttonUrl", label: "Button link", placeholder: "/" },
  ],
  defaultProps: {
    title: "Limited Time Offer",
    subtitle: "Sale ends in",
    background: "dark",
    buttonText: "Shop the Sale",
    buttonUrl: "/",
  },
};

const logoListMeta: SectionMeta = {
  type: "logo-list",
  label: "Logo List",
  description: "Press mentions or brand partner logos",
  fieldSchema: [
    { type: "text", key: "title", label: "Label", placeholder: "As seen in" },
    {
      type: "select",
      key: "logoWidth",
      label: "Logo size",
      options: [
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
      ],
    },
    {
      type: "list",
      key: "logos",
      label: "Logo",
      itemDefault: { url: "", alt: "" },
      itemFields: [
        { type: "image-upload", key: "url", label: "Logo image" },
        { type: "text", key: "alt", label: "Brand name", placeholder: "Vogue" },
      ],
    },
  ],
  defaultProps: { title: "As seen in", logoWidth: "md", logos: [] },
};

const collageMeta: SectionMeta = {
  type: "collage",
  label: "Collage",
  description: "Asymmetric image grid / lookbook",
  fieldSchema: [
    {
      type: "select",
      key: "layout",
      label: "Layout",
      options: [
        { value: "asymmetric", label: "Asymmetric" },
        { value: "grid", label: "Grid" },
        { value: "mosaic", label: "Mosaic" },
      ],
    },
    {
      type: "list",
      key: "items",
      label: "Image block",
      itemDefault: { image: "", title: "", buttonText: "", buttonUrl: "" },
      itemFields: [
        { type: "image-upload", key: "image", label: "Image" },
        { type: "text", key: "title", label: "Overlay title", placeholder: "New arrivals" },
        { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop now" },
        { type: "text", key: "buttonUrl", label: "Link", placeholder: "/" },
      ],
    },
  ],
  defaultProps: { layout: "asymmetric", items: [] },
};

const categoriesMeta: SectionMeta = {
  type: "categories",
  label: "Categories",
  description: "Grid of shop categories with portrait images",
  pages: ["home", "collection", "search"],
  fieldSchema: [
    { type: "text", key: "title", label: "Label", placeholder: "Shop by category" },
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "grid", label: "Image grid" },
        { value: "pills", label: "Pills" },
      ],
    },
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) })),
    },
    { type: "multiselect-shop-categories", key: "categoryIds", label: "Show only (leave empty for all)" },
  ],
  defaultProps: { categoryIds: [], columns: 4, variant: "grid" },
};

export const pipelineSectionMeta: SectionMeta[] = [
  navbarMeta,
  announcementMeta,
  bannerMeta,
  collectionMeta,
  featuredProductMeta,
  categoriesMeta,
  imageBannerMeta,
  multiColumnMeta,
  collageMeta,
  highlightsMeta,
  imageTextMeta,
  richTextMeta,
  testimonialsMeta,
  productTestimonialsMeta,
  galleryMeta,
  countdownMeta,
  logoListMeta,
  newsletterMeta,
  faqMeta,
  statsMeta,
  dividerMeta,
];
