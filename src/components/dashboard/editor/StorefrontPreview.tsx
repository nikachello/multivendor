"use client";

import React from "react";

type Props = {
  shopSlug: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isLoading: boolean;
  onLoad: () => void;
  viewMode: "desktop" | "mobile";
};

export default function StorefrontPreview({
  shopSlug,
  iframeRef,
  isLoading,
  onLoad,
  viewMode,
}: Props) {
  return (
    <div className={`flex-1 overflow-y-auto min-w-0 w-full transition-opacity duration-300 ${isLoading ? "opacity-30" : "opacity-100"}`}>
      <div className={viewMode === "mobile" ? "max-w-[390px] mx-auto h-full" : "w-full h-full"}>
        <iframe
          ref={iframeRef}
          src={`/shop/${shopSlug}`}
          className="w-full h-full border-0"
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
