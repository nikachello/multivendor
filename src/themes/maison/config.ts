import type { ThemeConfig } from "@/themes/types";

export const maisonConfig: ThemeConfig = {
  palette: {
    accent: "oklch(0.47 0.1 42)",
    muted: "#8c8170",
    subtle: "#e8e0d2",
    surface: "#f3ece0",
  },

  type: {
    sectionHeading:
      "font-display text-3xl md:text-4xl font-semibold text-[#1f1b16] leading-tight",
    cardHeading: "font-display text-sm text-[#1f1b16] leading-snug",
    body: "text-sm text-[var(--muted)] leading-[1.9]",
    label: "text-[11px] tracking-[0.18em] uppercase text-[var(--muted)]",
    price: "text-sm text-[var(--muted)]",
    display: "font-display text-5xl md:text-6xl font-semibold text-[#1f1b16] leading-none",
    displayFont: "font-display",
  },

  layout: {
    sectionPy: "py-20",
    contentPx: "px-5 md:px-10",
    gridGap: "gap-4",
    productGridCols: "grid-cols-2 md:grid-cols-3",
    headingAlign: "left",
  },

  components: {
    button: {
      className:
        "border border-[var(--primary)] text-[var(--primary)] text-[11px] tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200",
      style: { borderRadius: "var(--radius)" },
    },
    input:
      "bg-transparent border px-5 py-3.5 text-sm outline-none transition-colors opacity-80 focus:opacity-100",
    divider: "border-t border-[var(--subtle)]",
    productImage: {
      bg: "bg-[var(--surface)]",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper:
        "w-full py-2.5 px-4 text-center text-[11px] tracking-[0.18em] uppercase",
    },
    newsletter: {
      wrapper: "py-20 bg-[var(--primary)]",
      inputStyle: {
        borderColor: "var(--secondary)",
        color: "var(--secondary)",
      },
      buttonStyle: {
        backgroundColor: "var(--secondary)",
        color: "var(--primary)",
        borderRadius: "var(--radius)",
      },
    },
    testimonial: {
      quoteVisible: true,
      quoteClass: "font-display text-5xl font-light text-[var(--subtle)] leading-none mb-4",
    },
    categories: { aspectRatio: "3/4" },
    highlights: { variant: "divided" },
  },

  defaults: {
    primaryColor: "#1f1b16",
    secondaryColor: "#fbf7f0",
    pageBackground: "#fbf7f0",
    borderRadius: "none",
    fontFamily: "serif",
  },
};
