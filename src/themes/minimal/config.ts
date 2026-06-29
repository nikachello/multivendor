import type { ThemeConfig } from "@/themes/types";

export const minimalConfig: ThemeConfig = {
  palette: {
    accent: "#09090b",
    muted: "#737373",
    subtle: "#E5E5E5",
    surface: "#F5F5F5",
  },

  type: {
    sectionHeading:
      "text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900",
    cardHeading: "text-sm font-medium text-neutral-900",
    body: "text-sm text-[var(--muted)] leading-relaxed",
    label: "text-xs tracking-wide uppercase text-[var(--muted)] font-medium",
    price: "text-sm text-[var(--muted)]",
    display: "text-4xl md:text-5xl font-bold text-neutral-900 leading-none",
    displayFont: "font-sans",
  },

  layout: {
    sectionPy: "py-16",
    contentPx: "px-5 md:px-10",
    gridGap: "gap-6",
    productGridCols: "grid-cols-2 md:grid-cols-4",
    headingAlign: "left",
  },

  components: {
    button: {
      className:
        "bg-[var(--primary)] text-[var(--secondary)] px-7 py-3 text-sm hover:opacity-90 transition-opacity",
      style: { borderRadius: "var(--radius)" },
    },
    input:
      "border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors",
    divider: "border-t border-[var(--subtle)]",
    productImage: {
      bg: "bg-[var(--surface)]",
      aspectRatio: "4/5",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2 px-4 text-center text-sm",
    },
    newsletter: {
      wrapper: "py-20 px-5 bg-[var(--primary)]",
      inputStyle: {
        borderColor: "rgba(255,255,255,0.2)",
        color: "white",
        backgroundColor: "rgba(255,255,255,0.1)",
      },
      buttonStyle: { backgroundColor: "white", color: "#171717" },
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "1/1" },
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
