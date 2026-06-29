import type { ThemeConfig } from "@/themes/types";

export const roasterConfig: ThemeConfig = {
  palette: {
    accent: "oklch(0.42 0.07 50)",
    muted: "#6b5640",
    subtle: "#e7d9c5",
    surface: "#ecdfc9",
  },

  type: {
    sectionHeading: "font-display text-2xl md:text-3xl font-semibold text-[#39291a] leading-tight",
    cardHeading: "font-display text-sm text-[#39291a] leading-snug",
    body: "text-sm text-[#6b5640] leading-relaxed",
    label: "text-[11px] tracking-wide uppercase font-semibold text-[#6b5640]",
    price: "text-sm text-[#6b5640]",
    display: "font-display text-4xl md:text-5xl font-semibold text-[#39291a] leading-tight",
    displayFont: "font-display",
  },

  layout: {
    sectionPy: "py-16",
    contentPx: "px-6 md:px-10",
    gridGap: "gap-4",
    productGridCols: "grid-cols-2 md:grid-cols-3",
    headingAlign: "center",
  },

  components: {
    button: {
      className: "text-[#f6ede0] text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity",
      style: { backgroundColor: "oklch(0.42 0.07 50)", borderRadius: "8px" },
    },
    input: "border border-[#e7d9c5] px-4 py-3 text-sm outline-none focus:border-[#6b5640] transition-colors bg-transparent",
    divider: "border-t border-[#e7d9c5]",
    productImage: {
      bg: "bg-[#ecdfc9]",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2 px-4 text-center text-sm",
    },
    newsletter: {
      wrapper: "py-16 px-6",
      inputStyle: { borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" },
      buttonStyle: { backgroundColor: "white", color: "#39291a", borderRadius: "8px" },
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "3/4" },
    highlights: { variant: "divided" },
  },

  defaults: {
    primaryColor: "oklch(0.42 0.07 50)",
    secondaryColor: "#f6ede0",
    pageBackground: "#f6ede0",
    borderRadius: "md",
    fontFamily: "serif",
  },
};
