import type { ThemeConfig } from "@/themes/types";

export const formaConfig: ThemeConfig = {
  palette: {
    accent: "oklch(0.68 0.2 38)",
    muted: "#b3a9a0",
    subtle: "#2a2622",
    surface: "#211d19",
  },

  type: {
    sectionHeading: "text-2xl md:text-3xl font-black text-[#f5f1ea] leading-tight uppercase tracking-[0.02em]",
    cardHeading: "text-xs font-bold text-[#f5f1ea] uppercase tracking-[0.04em]",
    body: "text-sm text-[#b3a9a0] leading-relaxed",
    label: "text-[11px] tracking-[0.18em] uppercase font-bold text-[#b3a9a0]",
    price: "text-sm text-[#b3a9a0]",
    display: "text-5xl md:text-7xl font-black text-[#f5f1ea] leading-none tracking-[-0.02em]",
    displayFont: "font-sans",
  },

  layout: {
    sectionPy: "py-16",
    contentPx: "px-6 md:px-10",
    gridGap: "gap-0",
    productGridCols: "grid-cols-2 md:grid-cols-4",
    headingAlign: "left",
  },

  components: {
    button: {
      className: "text-[#141210] text-sm font-bold px-7 py-3.5 hover:opacity-90 transition-opacity uppercase tracking-[0.06em]",
      style: { backgroundColor: "oklch(0.68 0.2 38)", borderRadius: "0px" },
    },
    input: "border border-[#2a2622] px-4 py-3 text-sm outline-none bg-transparent text-[#f5f1ea] focus:border-[#b3a9a0] transition-colors",
    divider: "border-t border-[#2a2622]",
    productImage: {
      bg: "bg-[#211d19]",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-widest",
    },
    newsletter: {
      wrapper: "py-20 bg-[#1a1714]",
      inputStyle: { borderColor: "#2a2622", backgroundColor: "#211d19", color: "#f5f1ea" },
      buttonStyle: { backgroundColor: "oklch(0.68 0.2 38)", color: "#141210", borderRadius: "0" },
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "4/5" },
    highlights: { variant: "cards" },
  },

  defaults: {
    primaryColor: "oklch(0.68 0.2 38)",
    secondaryColor: "#141210",
    pageBackground: "#141210",
    borderRadius: "none",
    fontFamily: "sans",
  },
};
