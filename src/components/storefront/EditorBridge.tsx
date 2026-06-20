// acts as a client component to exchange iframe and page.tsx data

"use client";

import React, { useEffect } from "react";

const EditorBridge = () => {
  // Notify parent editor which page is currently loaded in the iframe
  useEffect(() => {
    if (window === window.top) return;
    window.parent.postMessage(
      { type: "PAGE_LOAD", pathname: window.location.pathname },
      "*",
    );
  }, []);

  useEffect(() => {
    if (window === window.top) return;

    const handler = (e: MouseEvent) => {
      const el = (e.target as Element).closest("[data-section-id]");
      if (!el) return;
      const id = el.getAttribute("data-section-id");
      window.parent.postMessage({ type: "SECTION_CLICK", id }, "*");
    };
    window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (window === window.top) return;
    let highlighted: Element | null = null; // inaxavs romeli elementia monishnuli
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "SELECT_SECTION") return;
      if (highlighted !== null) {
        (highlighted as HTMLElement).style.outline = "none";
      }

      const el = document.querySelector(`[data-section-id="${e.data.id}"]`);
      if (!el) return;

      (el as HTMLElement).style.outline = "2px solid #3b82f6";
      (el as HTMLElement).style.outlineOffset = "-5px";

      highlighted = el;
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (window === window.top) return;

    const fontMap: Record<string, string> = {
      sans: "system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "ui-monospace, monospace",
    };
    const radiusMap: Record<string, string> = {
      none: "0px", sm: "4px", md: "8px", lg: "16px",
    };

    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "UPDATE_THEME") return;
      const { theme } = e.data;
      const root = document.querySelector("[data-theme-root]") as HTMLElement;
      if (!root) return;
      root.style.setProperty("--primary", theme.primaryColor);
      root.style.setProperty("--secondary", theme.secondaryColor);
      root.style.setProperty("--page-bg", theme.pageBackground);
      root.style.setProperty("--font", fontMap[theme.fontFamily] ?? fontMap.sans);
      root.style.setProperty("--radius", radiusMap[theme.borderRadius] ?? "0px");
      root.style.fontFamily = "var(--font)";
      root.style.backgroundColor = "var(--page-bg)";
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (window === window.top) return;

    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "REORDER_SECTIONS") return;

      const sectionsOrder = e.data?.order;

      const parentEl =
        document.querySelector("[data-section-id]")?.parentElement;

      sectionsOrder.forEach((id: string) => {
        const el = document.querySelector(`[data-section-id="${id}"]`);
        if (el) parentEl?.appendChild(el);
      });

      // if (!el) return;
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
};

export default EditorBridge;
