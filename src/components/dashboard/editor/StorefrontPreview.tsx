"use client";

import React from "react";

type Props = {
  shopSlug: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isLoading: boolean;
  onLoad: () => void;
};

export default function StorefrontPreview({
  shopSlug,
  iframeRef,
  isLoading,
  onLoad,
}: Props) {
  return (
    <div
      className={`flex-1 overflow-y-auto bg-white min-w-0 w-full ${isLoading ? "opacity-30" : "opacity-100"}`}
    >
      <iframe
        ref={iframeRef}
        src={`/shop/${shopSlug}`}
        className="w-full h-full border-0"
        onLoad={onLoad}
      ></iframe>
    </div>
  );
}
