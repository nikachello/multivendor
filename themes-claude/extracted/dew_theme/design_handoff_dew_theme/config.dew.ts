// ============================================================================
// DEW — Beauty / skincare / wellness theme
// The trust-led counterpoint to ÉCRU. Warm porcelain-blush paper, cocoa-plum
// ink, a soft periwinkle accent. Rounded geometric sans (Plus Jakarta Sans),
// generous radius + pill buttons, centered headings. Conversion-forward:
// shade swatches, star ratings, ingredient accordion, before/after, reviews,
// and a routine/bundle builder.
//
// Google Font to load separately (NOT via CDN link in the theme):
//   • Plus Jakarta Sans — all type (weights 400/500/600/700/800)
//     Falls back to system-ui gracefully.
// ============================================================================

export const dewTheme: ThemeConfig = {
  palette: {
    accent:  "#6C63E8", // soft periwinkle — CTAs, swatch ring, stars, eyebrows
    muted:   "#8A8190", // mauve-grey — secondary text
    subtle:  "#E7DBD2", // warm sand — hairlines & borders
    surface: "#FCF8F3", // clean cream — cards, product-image base
  },

  type: {
    display:        "var(--sans)",  // hero — Jakarta 700, tight tracking
    sectionHeading: "var(--sans)",  // section H2s — Jakarta 700, centered
    cardHeading:    "var(--sans)",  // product / card names — Jakarta 600
    body:           "var(--sans)",  // paragraph copy — Jakarta 400/500
    label:          "var(--sans)",  // lowercase eyebrows — Jakarta 700, tracked
    price:          "var(--sans)",  // Jakarta 600
    displayFont:    "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },

  layout: {
    sectionPy:       "clamp(60px, 7.5vw, 104px)",
    contentPx:       "clamp(22px, 6vw, 80px)",
    gridGap:         "clamp(16px, 2vw, 26px)",
    productGridCols: 4,
    headingAlign:    "center",
  },

  components: {
    button: {
      // primary CTA — pill, periwinkle, inverts to ink on hover
      className: "dew-btn",
      style:
        "background:var(--accent);color:#ffffff;border:none;" +
        "padding:15px 30px;border-radius:var(--pill);" +
        "font-family:var(--sans);font-size:15px;font-weight:600;cursor:pointer;",
    },
    input:
      "background:#ffffff;border:none;outline:none;" +
      "font-family:var(--sans);font-size:15px;padding:16px 20px;" +
      "border-radius:var(--pill);color:var(--ink);",
    divider: "border:none;border-top:1px solid var(--subtle);margin:0;",
    productImage: {
      // soft 'dewy' radial wash; square crop for cosmetics/packshots
      bg: "radial-gradient(115% 115% at 32% 26%, #FFFFFF, var(--sage))",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper:
        "background:var(--accent);color:#ffffff;text-align:center;" +
        "padding:11px 16px;font-size:12.5px;font-weight:600;letter-spacing:.01em;",
    },
    newsletter: {
      // rounded periwinkle-wash card, centered, pill input + button
      wrapper:
        "background:radial-gradient(120% 140% at 80% 20%, #E7DCEF, #D9D2F2);" +
        "border-radius:calc(var(--radius) * 2);text-align:center;" +
        "padding:clamp(40px,5vw,72px) clamp(24px,4vw,56px);",
      inputStyle:
        "background:#ffffff;border:none;outline:none;color:var(--ink);" +
        "font-family:var(--sans);font-size:15px;padding:16px 20px;" +
        "border-radius:var(--pill);flex:1;min-width:200px;",
      buttonStyle:
        "background:var(--accent);color:#ffffff;border:none;cursor:pointer;" +
        "padding:16px 30px;border-radius:var(--pill);" +
        "font-size:15px;font-weight:600;",
    },
    testimonial: {
      quoteVisible: true,
      quoteClass:
        "font-family:var(--sans);font-weight:500;font-size:17px;" +
        "line-height:1.5;color:var(--ink);", // paired with ★★★★★ + verified badge
    },
    categories: {
      aspectRatio: "1/1", // rounded square tiles with name overlay
    },
    highlights: {
      variant: "cards", // rounded surface cards w/ numbered pill badge
    },
  },

  defaults: {
    primaryColor:   "#2C2530", // cocoa-plum ink — text, dark panels
    secondaryColor: "#6C63E8", // periwinkle — accent pairing
    pageBackground: "#F4ECE6", // warm porcelain blush
    borderRadius:   "16px",    // soft, friendly (pills use 999px)
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
};

// ----------------------------------------------------------------------------
// Theme-internal tint tokens (beyond the four core palette fields). Set these
// as CSS variables on the theme root alongside the palette above:
//   --sage : #E7EDE0   calm green-grey  (alternating sections, image wash)
//   --blush: #F1E0DA   soft blush       (secondary section bg, soft buttons)
//   --pill : 999px     fully-rounded radius for buttons/inputs/badges
// ----------------------------------------------------------------------------
