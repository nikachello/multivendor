import type { ThemeConfig } from "@/themes/types";

export const dewConfig: ThemeConfig = {
  palette: {
    accent:  "#6C63E8",
    muted:   "#8A8190",
    subtle:  "#E7DBD2",
    surface: "#FCF8F3",
  },

  type: {
    display:        "font-jakarta font-bold tracking-[-0.03em] leading-[1.02]",
    sectionHeading: "font-jakarta font-bold tracking-[-0.02em] text-[#2C2530]",
    cardHeading:    "font-jakarta font-semibold text-[15px] text-[#2C2530]",
    body:           "font-jakarta text-[15px] leading-[1.6] text-[var(--muted)]",
    label:          "font-jakarta font-bold text-[12px] tracking-[0.14em] text-[var(--accent)]",
    price:          "font-jakarta font-semibold text-[15px] text-[#2C2530]",
    displayFont:    "font-jakarta",
  },

  layout: {
    sectionPy:       "py-16 md:py-24 xl:py-28",
    contentPx:       "px-6 md:px-12 xl:px-20",
    gridGap:         "gap-4 lg:gap-6",
    productGridCols: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    headingAlign:    "center",
  },

  components: {
    button: {
      className: "font-jakarta font-semibold text-[15px] text-white px-8 py-4 hover:opacity-90 transition-opacity",
      style: { backgroundColor: "var(--accent)", borderRadius: "var(--pill)" },
    },
    input:   "font-jakarta text-[15px] bg-white border-0 outline-none px-5 py-4 text-[#2C2530]",
    divider: "border-t border-[var(--subtle)]",
    productImage: {
      bg:          "bg-[var(--surface)]",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-[11px] px-4 text-center text-[12.5px] font-semibold tracking-[0.01em] font-jakarta",
    },
    newsletter: {
      wrapper: "py-16 xl:py-28 px-6 text-center",
      inputStyle: {
        background:  "#ffffff",
        border:      "none",
        outline:     "none",
        color:       "#2C2530",
        fontFamily:  "var(--font-jakarta), system-ui, sans-serif",
        fontSize:    "15px",
        padding:     "16px 20px",
        borderRadius:"999px",
        flex:        "1",
        minWidth:    "200px",
      },
      buttonStyle: {
        background:   "var(--accent)",
        color:        "#ffffff",
        border:       "none",
        cursor:       "pointer",
        padding:      "16px 30px",
        borderRadius: "999px",
        fontSize:     "15px",
        fontWeight:   "600",
        fontFamily:   "var(--font-jakarta), system-ui, sans-serif",
      },
    },
    testimonial: {
      quoteVisible: true,
      quoteClass:   "font-jakarta font-medium text-[17px] leading-[1.5] text-[#2C2530]",
    },
    categories: {
      aspectRatio: "1/1",
    },
    highlights: {
      variant: "cards",
    },
  },

  defaults: {
    primaryColor:   "#2C2530",
    secondaryColor: "#6C63E8",
    pageBackground: "#F4ECE6",
    borderRadius:   "lg",
    fontFamily:     "jakarta",
  },

  extras: {
    "--sage":  "#E7EDE0",
    "--blush": "#F1E0DA",
    "--pill":  "999px",
  },
};
