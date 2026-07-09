import type { ThemeConfig } from "@/themes/types";

export const creatorConfig: ThemeConfig = {
  palette: {
    accent: "#C2582E",
    muted: "#86796A",
    subtle: "#E6E0D6",
    surface: "#FFFFFF",
  },

  type: {
    sectionHeading: "text-xl font-semibold text-[var(--creator-on-surface)]",
    cardHeading: "text-base font-semibold text-[var(--creator-on-surface)]",
    body: "text-sm text-[var(--creator-muted)] leading-relaxed",
    label: "text-xs font-semibold uppercase tracking-wide text-[var(--creator-muted)]",
    price: "text-lg font-bold tabular-nums text-[var(--creator-on-surface)]",
    display: "text-2xl font-semibold text-[var(--creator-on-surface)]",
    displayFont: "font-sans",
  },

  layout: {
    sectionPy: "py-8",
    contentPx: "px-5",
    gridGap: "gap-3",
    productGridCols: "grid-cols-2",
    headingAlign: "center",
  },

  components: {
    button: {
      className:
        "h-12 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold flex items-center justify-center active:scale-[0.98]",
    },
    input:
      "h-12 rounded-xl bg-[var(--page-bg)] ring-1 ring-[var(--creator-subtle)] px-4 text-sm outline-none focus:ring-[var(--primary)]",
    divider: "border-t border-[var(--creator-subtle)]",
    productImage: {
      bg: "bg-[var(--creator-subtle)]",
      aspectRatio: "1/1",
    },
  },

  sections: {
    announcement: {
      wrapper: "w-full py-2 px-4 text-center text-sm",
    },
    newsletter: {
      wrapper: "py-8 px-5",
      inputStyle: {},
      buttonStyle: {},
    },
    testimonial: {
      quoteVisible: false,
      quoteClass: "",
    },
    categories: { aspectRatio: "1/1" },
    highlights: { variant: "cards" },
  },

  defaults: {
    primaryColor: "#6C63FF",
    secondaryColor: "#ffffff",
    pageBackground: "#FAF7F2",
    borderRadius: "lg",
    fontFamily: "sans",
  },

  extras: {
    "--creator-accent": "#C2582E",
    "--creator-muted": "#86796A",
    "--creator-subtle": "#E6E0D6",
    "--creator-surface": "#FFFFFF",
    "--creator-on-surface": "#211D17",
    "--creator-link-btn-bg": "#F3EEE5",
    "--creator-display-font": "'Instrument Serif', serif",
    "--creator-body-font": "'Public Sans', sans-serif",
  },
};
