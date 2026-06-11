import { ShopSection, SectionType } from "@/lib/types/store-section";

// Schema-driven form definitions.
// Instead of writing a separate form component per section type,
// we describe what fields each section has and render them generically.
// Adding a new section type = adding one entry here, no new UI code.

// FlatFieldDef: safe to use inside list items (no nesting)
export type FlatFieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "color"; key: string; label: string }
  | { type: "select"; key: string; label: string; options: { value: string | number; label: string }[] };

// FieldDef extends FlatFieldDef with two composite types:
// - "list": an array of items, each with its own set of FlatFieldDef fields
// - "select-shop-categories": a select whose options come from the shop's categories at runtime
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
  pros: "Features",
  testimonials: "Testimonials",
};

// Default props used when adding a new section instance.
// navbar is excluded — it's structural and not user-addable.
type AddableSection = Exclude<ShopSection, { type: "navbar" }>;
export type AddableSectionType = AddableSection["type"];

export const addableSections: {
  type: AddableSectionType;
  description: string;
}[] = [
  { type: "announcement", description: "Top bar with a short message or promo" },
  { type: "banner", description: "Full-width hero image with headline" },
  { type: "categories", description: "Grid of shop categories" },
  { type: "collection", description: "Product grid from a category" },
  { type: "pros", description: "Feature highlights / selling points" },
  { type: "testimonials", description: "Customer review cards" },
];

export const sectionDefaults: Record<AddableSectionType, AddableSection["props"]> = {
  announcement: { text: "Free shipping on orders over $50", bgColor: "#F5D7C7", textColor: "#000000" },
  banner: { title: "New Arrivals", subtitle: "Discover our latest collection", image: "/banner.jpg", buttonText: "Shop Now", href: "/" },
  categories: { title: "Shop by Category", categoryIds: [], columns: 4 },
  collection: { categoryId: "" },
  pros: { pros: [] },
  testimonials: { testimonials: [] },
};

export const sectionFieldSchema: Partial<Record<SectionType, FieldDef[]>> = {
  announcement: [
    { type: "text", key: "text", label: "Text", placeholder: "Free shipping on orders over $50" },
    { type: "text", key: "link", label: "Link URL", placeholder: "/collections/all" },
    { type: "text", key: "linkText", label: "Link Text", placeholder: "Shop now" },
    { type: "color", key: "bgColor", label: "Background color" },
    { type: "color", key: "textColor", label: "Text color" },
  ],
  banner: [
    { type: "text", key: "title", label: "Title", placeholder: "New arrivals" },
    { type: "text", key: "subtitle", label: "Subtitle", placeholder: "Discover our latest collection" },
    { type: "text", key: "image", label: "Image URL", placeholder: "/banner.jpg" },
    { type: "text", key: "buttonText", label: "Button text", placeholder: "Shop now" },
    { type: "text", key: "href", label: "Button link", placeholder: "/" },
  ],
  categories: [
    { type: "text", key: "title", label: "Section title", placeholder: "Shop by Category" },
    {
      type: "select",
      key: "columns",
      label: "Columns",
      options: [2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) })),
    },
  ],
  collection: [
    { type: "select-shop-categories", key: "categoryId", label: "Category" },
  ],
  testimonials: [
    {
      type: "list",
      key: "testimonials",
      label: "Testimonial",
      itemDefault: { name: "", testimony: "", position: "", rating: 5 },
      itemFields: [
        { type: "text", key: "name", label: "Name", placeholder: "Jane Doe" },
        { type: "text", key: "position", label: "Position", placeholder: "CEO at Acme" },
        { type: "textarea", key: "testimony", label: "Testimonial", placeholder: "Amazing product!" },
        {
          type: "select",
          key: "rating",
          label: "Rating",
          options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} ★` })),
        },
      ],
    },
  ],
  pros: [
    {
      type: "list",
      key: "pros",
      label: "Feature",
      itemDefault: { type: "pro", title: "", description: "", imageUrl: "", buttonText: "", buttonUrl: "" },
      itemFields: [
        {
          type: "select",
          key: "type",
          label: "Style",
          options: [
            { value: "pro", label: "Text card" },
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
};
