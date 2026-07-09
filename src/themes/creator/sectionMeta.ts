import type { SectionMeta } from "@/themes/types";

export const creatorProfileMeta: SectionMeta = {
  type: "creator-profile",
  label: "Profile",
  description: "Avatar or logo, name, bio, and social links",
  fieldSchema: [
    {
      type: "select",
      key: "variant",
      label: "Style",
      options: [
        { value: "personal", label: "Personal (circle avatar)" },
        { value: "brand", label: "Brand (logo tile)" },
      ],
    },
    { type: "image-upload", key: "image", label: "Photo / Logo" },
    { type: "text", key: "name", label: "Name", placeholder: "Your name or brand" },
    { type: "textarea", key: "bio", label: "Bio", placeholder: "Short bio or tagline…" },
    { type: "text", key: "locationBadge", label: "Location badge", placeholder: "Tbilisi" },
    {
      type: "list",
      key: "socialLinks",
      label: "Social links",
      itemDefault: { platform: "instagram", url: "" },
      itemFields: [
        {
          type: "select",
          key: "platform",
          label: "Platform",
          options: [
            { value: "instagram", label: "Instagram" },
            { value: "tiktok", label: "TikTok" },
            { value: "youtube", label: "YouTube" },
            { value: "twitter", label: "X / Twitter" },
            { value: "whatsapp", label: "WhatsApp" },
          ],
        },
        { type: "text", key: "url", label: "URL", placeholder: "https://instagram.com/yourhandle" },
      ],
    },
  ],
  defaultProps: { variant: "personal", socialLinks: [] },
};

export const creatorLinksMeta: SectionMeta = {
  type: "creator-links",
  label: "Link Buttons",
  description: "Stacked full-width buttons — the Linktree equivalent",
  fieldSchema: [
    {
      type: "list",
      key: "items",
      label: "Links",
      itemDefault: { id: "", label: "My link", url: "", emoji: "", style: "filled", disabled: false },
      itemFields: [
        { type: "text", key: "label", label: "Label", placeholder: "Shop my store" },
        { type: "text", key: "url", label: "URL", placeholder: "https://…" },
        { type: "text", key: "emoji", label: "Emoji prefix", placeholder: "🛍️" },
        {
          type: "select",
          key: "style",
          label: "Style",
          options: [
            { value: "filled", label: "Filled" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
          ],
        },
      ],
    },
  ],
  defaultProps: { items: [] },
};

export const creatorFeaturedProductMeta: SectionMeta = {
  type: "creator-featured-product",
  label: "Featured Product",
  description: "Hero product spotlight with add-to-cart",
  fieldSchema: [
    { type: "text", key: "productId", label: "Product ID (copy from dashboard URL)", placeholder: "clxyz123…" },
    { type: "text", key: "badge", label: "Badge text", placeholder: "New drop" },
    { type: "text", key: "ctaLabel", label: "Button label", placeholder: "Add to cart" },
  ],
  defaultProps: { productId: "", badge: "", ctaLabel: "Add to cart" },
};

export const creatorProductGridMeta: SectionMeta = {
  type: "creator-product-grid",
  label: "Product Grid",
  description: "2-column compact product grid",
  fieldSchema: [
    { type: "text", key: "title", label: "Section title", placeholder: "Shop" },
    { type: "select-shop-categories", key: "categoryId", label: "Category (leave empty for all)" },
    {
      type: "select",
      key: "limit",
      label: "Max products",
      options: [4, 6, 8, 12].map((n) => ({ value: n, label: String(n) })),
    },
  ],
  defaultProps: { title: "Shop", categoryId: "", limit: 6 },
};

export const creatorCountdownMeta: SectionMeta = {
  type: "creator-countdown",
  label: "Drop Countdown",
  description: "Timer counting down to a product drop or event",
  fieldSchema: [
    { type: "text", key: "dropName", label: "Drop name", placeholder: "Summer collection" },
    { type: "text", key: "targetDate", label: "Target date (ISO)", placeholder: "2025-08-01T12:00:00Z" },
    { type: "text", key: "liveCtaLabel", label: "Live CTA label", placeholder: "Shop now" },
    { type: "text", key: "liveCtaUrl", label: "Live CTA URL", placeholder: "/collections/summer" },
  ],
  defaultProps: { dropName: "Upcoming drop", targetDate: "", liveCtaLabel: "Shop now", liveCtaUrl: "#" },
};

export const creatorOfferCardsMeta: SectionMeta = {
  type: "creator-offer-cards",
  label: "Offer Cards",
  description: "Cards for courses, programs, or 1:1 sessions",
  fieldSchema: [
    { type: "text", key: "title", label: "Section title", placeholder: "Work with me" },
    {
      type: "list",
      key: "items",
      label: "Offers",
      itemDefault: { id: "", icon: "📚", title: "", description: "", price: "", ctaLabel: "Get access", ctaUrl: "" },
      itemFields: [
        { type: "text", key: "icon", label: "Icon emoji", placeholder: "📚" },
        { type: "image-upload", key: "image", label: "Image (optional)" },
        { type: "text", key: "title", label: "Title", placeholder: "1:1 Coaching" },
        { type: "textarea", key: "description", label: "Description", placeholder: "What's included…" },
        { type: "text", key: "price", label: "Price", placeholder: "$299" },
        { type: "text", key: "ctaLabel", label: "Button label", placeholder: "Book now" },
        { type: "text", key: "ctaUrl", label: "Button URL", placeholder: "https://calendly.com/…" },
      ],
    },
  ],
  defaultProps: { title: "Work with me", items: [] },
};

export const creatorSocialProofBarMeta: SectionMeta = {
  type: "creator-social-proof-bar",
  label: "Social Proof Bar",
  description: "Stat strip and optional brand logo row",
  fieldSchema: [
    {
      type: "list",
      key: "stats",
      label: "Stats",
      itemDefault: { value: "10k+", label: "Followers" },
      itemFields: [
        { type: "text", key: "value", label: "Value", placeholder: "10,000+" },
        { type: "text", key: "label", label: "Label", placeholder: "Students" },
      ],
    },
    {
      type: "list",
      key: "logos",
      label: "Brand logos (optional)",
      itemDefault: { url: "", alt: "" },
      itemFields: [
        { type: "image-upload", key: "url", label: "Logo image" },
        { type: "text", key: "alt", label: "Brand name", placeholder: "Forbes" },
      ],
    },
  ],
  defaultProps: { stats: [], logos: [] },
};

export const creatorShoppableImageMeta: SectionMeta = {
  type: "creator-shoppable-image",
  label: "Shoppable Image",
  description: "\"Shop this look\" — lifestyle photo with product link grid",
  fieldSchema: [
    { type: "image-upload", key: "image", label: "Image" },
    { type: "text", key: "caption", label: "Caption", placeholder: "Shop this look" },
    {
      type: "list",
      key: "products",
      label: "Product links",
      itemDefault: { id: "", label: "", url: "" },
      itemFields: [
        { type: "text", key: "label", label: "Product name", placeholder: "White sneakers" },
        { type: "text", key: "url", label: "URL", placeholder: "/product/white-sneakers" },
      ],
    },
  ],
  defaultProps: { caption: "", products: [] },
};

export const creatorAvailabilityMeta: SectionMeta = {
  type: "creator-availability",
  label: "Availability",
  description: "Scarcity block with progress bar for artisans and coaches",
  fieldSchema: [
    { type: "text", key: "headline", label: "Headline", placeholder: "Only 4 custom slots left" },
    { type: "text", key: "total", label: "Total spots", placeholder: "12" },
    { type: "text", key: "remaining", label: "Remaining spots", placeholder: "4" },
    { type: "text", key: "ctaLabel", label: "CTA label", placeholder: "Book now" },
    { type: "text", key: "ctaUrl", label: "CTA URL", placeholder: "https://calendly.com/…" },
    { type: "select", key: "waitlistEnabled", label: "Show waitlist form", options: [{ value: "false", label: "No" }, { value: "true", label: "Yes" }] },
  ],
  defaultProps: { headline: "Limited availability", total: 12, remaining: 8, ctaLabel: "Book now", ctaUrl: "#", waitlistEnabled: false },
};

export const creatorPortfolioMeta: SectionMeta = {
  type: "creator-portfolio",
  label: "Portfolio",
  description: "3-column visual grid with lightbox — for tattoo artists, photographers, makers",
  fieldSchema: [
    { type: "text", key: "title", label: "Section title", placeholder: "My work" },
    {
      type: "list",
      key: "images",
      label: "Photos",
      itemDefault: { id: "", url: "", alt: "" },
      itemFields: [
        { type: "image-upload", key: "url", label: "Photo" },
        { type: "text", key: "alt", label: "Description", placeholder: "Ceramic bowl" },
      ],
    },
  ],
  defaultProps: { title: "My work", images: [] },
};

export const creatorBookingMeta: SectionMeta = {
  type: "creator-booking",
  label: "Booking CTA",
  description: "Dominant single-CTA card — the most important thing on the page",
  fieldSchema: [
    { type: "image-upload", key: "image", label: "Background image (optional)" },
    { type: "text", key: "headline", label: "Headline", placeholder: "Book a session" },
    { type: "textarea", key: "description", label: "Description", placeholder: "What to expect…" },
    { type: "text", key: "meta", label: "Meta info", placeholder: "Response within 24h · from $50" },
    { type: "text", key: "ctaLabel", label: "Button label", placeholder: "Book now" },
    { type: "text", key: "ctaUrl", label: "Button URL", placeholder: "https://calendly.com/…" },
  ],
  defaultProps: { headline: "Book a session", ctaLabel: "Book now", ctaUrl: "#" },
};

export const creatorVideoMeta: SectionMeta = {
  type: "creator-video",
  label: "Video",
  description: "YouTube or TikTok embed — paste the URL",
  fieldSchema: [
    { type: "text", key: "url", label: "YouTube or TikTok URL", placeholder: "https://youtube.com/watch?v=…" },
    { type: "text", key: "title", label: "Title (optional)", placeholder: "Watch my latest video" },
    { type: "text", key: "description", label: "Description (optional)", placeholder: "…" },
  ],
  defaultProps: { url: "", title: "", description: "" },
};

export const creatorWhatsappCtaMeta: SectionMeta = {
  type: "creator-whatsapp-cta",
  label: "WhatsApp Order Button",
  description: "Full-width WhatsApp CTA for social-first shops",
  fieldSchema: [
    { type: "text", key: "phone", label: "Phone number (with country code)", placeholder: "+995555000000" },
    { type: "text", key: "label", label: "Button label", placeholder: "Order via WhatsApp" },
    { type: "textarea", key: "message", label: "Pre-filled message (optional)", placeholder: "Hi, I'd like to order…" },
  ],
  defaultProps: { phone: "", label: "Order via WhatsApp", message: "" },
};

export const creatorInfoStripMeta: SectionMeta = {
  type: "creator-info-strip",
  label: "Info Strip",
  description: "Trust signals: shipping, returns, pickup, payment methods",
  fieldSchema: [
    {
      type: "list",
      key: "items",
      label: "Info items",
      itemDefault: { id: "", icon: "🚚", text: "Free shipping" },
      itemFields: [
        { type: "text", key: "icon", label: "Icon emoji", placeholder: "🚚" },
        { type: "text", key: "text", label: "Text", placeholder: "Free shipping over 50 GEL" },
      ],
    },
  ],
  defaultProps: {
    items: [
      { id: "1", icon: "🚚", text: "Ships in 1–2 days" },
      { id: "2", icon: "↩️", text: "Free returns" },
      { id: "3", icon: "📍", text: "Tbilisi pickup" },
      { id: "4", icon: "💳", text: "Card & cash" },
    ],
  },
};

export const creatorSectionMeta: SectionMeta[] = [
  creatorProfileMeta,
  creatorLinksMeta,
  creatorFeaturedProductMeta,
  creatorProductGridMeta,
  creatorCountdownMeta,
  creatorOfferCardsMeta,
  creatorSocialProofBarMeta,
  creatorShoppableImageMeta,
  creatorAvailabilityMeta,
  creatorPortfolioMeta,
  creatorBookingMeta,
  creatorVideoMeta,
  creatorWhatsappCtaMeta,
  creatorInfoStripMeta,
];
