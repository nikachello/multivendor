import type { ThemeConfig } from "@/themes/types";

export const soloConfig: ThemeConfig = {
  palette: {
    accent: "oklch(0.55 0.12 68)",
    muted: "#7a6b4a",
    subtle: "#f0e6d2",
    surface: "#f1e6cf",
  },

  type: {
    sectionHeading: "font-display text-2xl md:text-3xl font-semibold text-[#2b2415] leading-tight",
    cardHeading: "font-display text-sm text-[#2b2415] leading-snug",
    body: "text-sm text-[#5c5034] leading-relaxed",
    label: "text-[11px] tracking-[0.16em] uppercase text-[#7a6b4a]",
    price: "text-base font-bold text-[#2b2415]",
    display: "font-display text-4xl md:text-5xl font-semibold text-[#2b2415] leading-tight",
    displayFont: "font-display",
  },

  layout: {
    sectionPy: "py-16",
    contentPx: "px-6 md:px-10",
    gridGap: "gap-6",
    productGridCols: "grid-cols-2 md:grid-cols-3",
    headingAlign: "left",
  },

  components: {
    button: {
      className: "text-[#fdf8ee] text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity",
      style: { backgroundColor: "oklch(0.55 0.12 68)", borderRadius: "8px" },
    },
    input: "border border-[#e0d3b8] px-4 py-3 text-sm outline-none focus:border-[#7a6b4a] transition-colors bg-transparent",
    divider: "border-t border-[#f0e6d2]",
    productImage: {
      bg: "bg-[#f1e6cf]",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2 px-4 text-center text-sm",
    },
    newsletter: {
      wrapper: "py-16 px-6",
      inputStyle: { borderColor: "#e0d3b8", backgroundColor: "transparent" },
      buttonStyle: { backgroundColor: "oklch(0.55 0.12 68)", color: "#fdf8ee", borderRadius: "8px" },
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "1/1" },
    highlights: { variant: "cards" },
  },

  defaults: {
    primaryColor: "oklch(0.55 0.12 68)",
    secondaryColor: "#fdf8ee",
    pageBackground: "#fdf8ee",
    borderRadius: "md",
    fontFamily: "serif",
  },
};
