import type { ThemeConfig } from "@/themes/types";

export const pipelineConfig: ThemeConfig = {
  palette: {
    accent: "#000000",
    muted: "#6b6b6b",
    subtle: "#e8e8e8",
    surface: "#f7f7f7",
  },

  type: {
    sectionHeading:
      "text-2xl md:text-4xl font-semibold tracking-tight text-neutral-900",
    cardHeading: "text-sm font-medium tracking-wide text-neutral-900",
    body: "text-sm text-[var(--muted)] leading-relaxed",
    label: "text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-400",
    price: "text-sm text-neutral-500",
    display: "text-5xl md:text-7xl font-bold tracking-tighter text-white leading-none",
    displayFont: "font-sans",
  },

  layout: {
    sectionPy: "py-24",
    contentPx: "px-5 md:px-12",
    gridGap: "gap-4",
    productGridCols: "grid-cols-2 md:grid-cols-4",
    headingAlign: "left",
  },

  components: {
    button: {
      className:
        "border border-current px-8 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors",
      style: { borderRadius: 0 },
    },
    input:
      "border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors bg-transparent",
    divider: "border-t border-[var(--subtle)]",
    productImage: {
      bg: "bg-[var(--surface)]",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2.5 px-4 text-center text-[11px] tracking-widest uppercase font-medium",
    },
    newsletter: {
      wrapper: "py-24 px-5 md:px-12 bg-neutral-900",
      inputStyle: {
        borderColor: "rgba(255,255,255,0.15)",
        color: "white",
        backgroundColor: "transparent",
      },
      buttonStyle: { backgroundColor: "white", color: "#000000", borderRadius: 0 },
    },
    testimonial: {
      quoteVisible: true,
      quoteClass: "text-4xl text-neutral-200 font-serif leading-none",
    },
    categories: { aspectRatio: "4/5" },
    highlights: { variant: "divided" },
  },

  defaults: {
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    pageBackground: "#ffffff",
    borderRadius: "none",
    fontFamily: "sans",
  },
};
