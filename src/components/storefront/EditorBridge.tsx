// acts as a client component to exchange iframe and page.tsx data

"use client";

import React, { useEffect } from "react";

const EditorBridge = () => {
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

  return null;
};

export default EditorBridge;
