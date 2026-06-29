import type { ThemeConfig } from "@/themes/types";

export const ecruConfig: ThemeConfig = {
  palette: {
    accent:  "#D8432B",
    muted:   "#6A5F51",
    subtle:  "#D7CDB9",
    surface: "#F6F1E7",
  },

  type: {
    display:        "font-bodoni font-medium text-5xl md:text-6xl xl:text-7xl leading-none tracking-[-0.01em]",
    sectionHeading: "font-bodoni font-medium text-4xl md:text-5xl leading-none tracking-[-0.01em] text-[#1B1714]",
    cardHeading:    "text-[14px] tracking-[0.01em] text-[#1B1714]",
    body:           "text-[15px] text-[var(--muted)] leading-[1.65]",
    label:          "font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--accent)]",
    price:          "text-[14px] text-[#1B1714] [font-variant-numeric:tabular-nums]",
    displayFont:    "font-bodoni",
  },

  layout: {
    sectionPy:       "py-16 md:py-20 xl:py-28",
    contentPx:       "px-6 md:px-10 xl:px-20",
    gridGap:         "gap-4 lg:gap-6",
    productGridCols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    headingAlign:    "left",
  },

  components: {
    button: {
      className: "text-[#EFE8DA] text-[12px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#EFE8DA] hover:text-[#1B1714] transition-colors",
      style: { backgroundColor: "#D8432B", borderRadius: "var(--radius)" },
    },
    input:   "bg-transparent border-0 border-b border-current outline-none text-[15px] px-1 py-3.5 text-inherit rounded-none",
    divider: "border-t border-[var(--subtle)]",
    productImage: {
      bg:          "bg-[var(--surface)]",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-[11px] px-4 text-center text-[11px] tracking-[0.22em] uppercase",
    },
    newsletter: {
      wrapper: "py-16 xl:py-28 px-6 text-center bg-[var(--primary)]",
      inputStyle: {
        backgroundColor: "transparent",
        border:          "none",
        color:           "#EFE8DA",
        fontFamily:      "inherit",
        fontSize:        "15px",
        padding:         "14px 4px",
        outline:         "none",
      },
      buttonStyle: {
        backgroundColor: "#1B1714",
        color:           "#EFE8DA",
        border:          "none",
        padding:         "14px 28px",
        fontSize:        "11px",
        letterSpacing:   "0.2em",
        textTransform:   "uppercase" as const,
        cursor:          "pointer",
        borderRadius:    "var(--radius)",
      },
    },
    testimonial: {
      quoteVisible: true,
      quoteClass:   "font-bodoni text-[34px] leading-none text-[var(--accent)] mb-4 block",
    },
    categories: {
      aspectRatio: "3/4",
    },
    highlights: {
      variant: "divided",
    },
  },

  defaults: {
    primaryColor:   "#D8432B",
    secondaryColor: "#EFE8DA",
    pageBackground: "#EFE8DA",
    borderRadius:   "none",
    fontFamily:     "sans",
  },
};
