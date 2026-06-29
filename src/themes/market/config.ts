import type { ThemeConfig } from "@/themes/types";

export const marketConfig: ThemeConfig = {
  palette: {
    accent: "oklch(0.68 0.16 50)",
    muted: "#52525b",
    subtle: "#f0f0f1",
    surface: "#f3f3f5",
  },

  type: {
    sectionHeading: "text-2xl md:text-3xl font-bold text-[#1c1c1e] leading-tight",
    cardHeading: "text-xs font-medium text-[#1c1c1e]",
    body: "text-sm text-[#52525b] leading-relaxed",
    label: "text-[10px] tracking-wide uppercase text-[#52525b] font-medium",
    price: "text-sm font-bold text-[#1c1c1e]",
    display: "text-3xl md:text-4xl font-extrabold text-[#1c1c1e] leading-tight",
    displayFont: "font-sans",
  },

  layout: {
    sectionPy: "py-10",
    contentPx: "px-4 md:px-7",
    gridGap: "gap-3",
    productGridCols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    headingAlign: "left",
  },

  components: {
    button: {
      className: "text-white text-sm font-semibold px-5 py-2.5 hover:opacity-90 transition-opacity",
      style: { backgroundColor: "oklch(0.55 0.13 145)", borderRadius: "8px" },
    },
    input: "border border-[#e5e5e7] px-4 py-3 text-sm outline-none focus:border-neutral-400 transition-colors rounded-lg",
    divider: "border-t border-[#f0f0f1]",
    productImage: {
      bg: "bg-[#f3f3f5]",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2 px-4 text-center text-sm font-medium",
    },
    newsletter: {
      wrapper: "py-12 px-5",
      inputStyle: { borderColor: "#e5e5e7", backgroundColor: "white" },
      buttonStyle: { backgroundColor: "oklch(0.55 0.13 145)", color: "white", borderRadius: "8px" },
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "1/1" },
    highlights: { variant: "cards" },
  },

  defaults: {
    primaryColor: "oklch(0.55 0.13 145)",
    secondaryColor: "#ffffff",
    pageBackground: "#ffffff",
    borderRadius: "md",
    fontFamily: "sans",
  },
};
