// ============================================================================
// ÉCRU — Flagship theme for fashion, lifestyle & apparel brands
// Identity: editorial atelier. Warm bone paper, espresso ink, one vermilion
// accent. High-contrast Didone display over tracked-out Helvetica labels.
// Hairline rules, sharp (zero-radius) corners, portrait product crops.
//
// Google Fonts to load separately (NOT via CDN link in the theme):
//   • Bodoni Moda  — display / section headings  (fallback: Didot, Georgia)
//   • Helvetica Neue is a system stack; no load required.
// ============================================================================

export const ecruTheme: ThemeConfig = {
  palette: {
    accent:  "#D8432B", // vermilion — CTAs, numbers, accents, eyebrows
    muted:   "#6A5F51", // muted brown-grey — secondary text
    subtle:  "#D7CDB9", // warm sand — hairline rules & borders
    surface: "#F6F1E7", // raised paper — alternating section backgrounds
  },

  type: {
    display:        "var(--serif)",  // hero headlines
    sectionHeading: "var(--serif)",  // section H2s
    cardHeading:    "var(--sans)",   // product / card names
    body:           "var(--sans)",   // paragraph copy
    label:          "var(--mono)",   // eyebrows, tags, captions (uppercase, tracked)
    price:          "var(--sans)",   // tabular-nums prices
    displayFont:    "'Bodoni Moda', Didot, 'Bodoni MT', Georgia, 'Times New Roman', serif",
  },

  layout: {
    sectionPy:       "clamp(64px, 8vw, 112px)",
    contentPx:       "clamp(22px, 6vw, 80px)",
    gridGap:         "clamp(16px, 1.6vw, 24px)",
    productGridCols: 4,
    headingAlign:    "left",
  },

  components: {
    button: {
      // primary CTA — solid vermilion, inverts to ink on hover
      className: "ecru-btn",
      style:
        "background:var(--accent);color:var(--page-bg);border:none;" +
        "padding:16px 34px;border-radius:var(--radius);" +
        "font-family:var(--sans);font-size:12px;letter-spacing:.2em;" +
        "text-transform:uppercase;cursor:pointer;",
    },
    input:
      "background:transparent;border:none;border-bottom:1px solid currentColor;" +
      "outline:none;font-family:var(--sans);font-size:15px;padding:14px 4px;" +
      "color:inherit;border-radius:0;",
    divider: "border:none;border-top:1px solid var(--subtle);margin:0;",
    productImage: {
      bg: "var(--surface)",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper:
        "background:var(--accent);color:var(--page-bg);text-align:center;" +
        "padding:11px 16px;font-family:var(--sans);font-size:11px;" +
        "letter-spacing:.22em;text-transform:uppercase;",
    },
    newsletter: {
      // sits on a full-bleed accent field; ink submit button
      wrapper:
        "background:var(--accent);color:var(--page-bg);text-align:center;" +
        "padding:var(--sectionPy) var(--contentPx);",
      inputStyle:
        "background:transparent;border:none;border-bottom:1px solid var(--page-bg);" +
        "outline:none;color:var(--page-bg);font-family:var(--sans);" +
        "font-size:15px;padding:14px 4px;flex:1;",
      buttonStyle:
        "background:var(--primary);color:var(--page-bg);border:none;cursor:pointer;" +
        "padding:14px 28px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;",
    },
    testimonial: {
      quoteVisible: true,
      quoteClass:
        "font-family:var(--serif);font-weight:500;" +
        "font-size:clamp(21px,1.9vw,26px);line-height:1.34;" +
        "letter-spacing:-.005em;color:var(--primary);",
    },
    categories: {
      aspectRatio: "3/4",
    },
    highlights: {
      variant: "divided", // 3 numbered blocks split by vertical hairlines
    },
  },

  defaults: {
    primaryColor:   "#1B1714", // espresso ink — text, ink buttons
    secondaryColor: "#D8432B", // vermilion — accent / highlight pairing
    pageBackground: "#EFE8DA", // warm bone paper
    borderRadius:   "0px",     // sharp, editorial — no rounded corners
    fontFamily:
      "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
  },
};
