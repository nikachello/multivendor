"use client";

import React from "react";

type Props = {
  shopSlug: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

export default function StorefrontPreview({ shopSlug, iframeRef }: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-white min-w-0 w-full">
      <iframe
        ref={iframeRef}
        src={`/shop/${shopSlug}`}
        className="w-full h-full border-0"
      ></iframe>
    </div>
  );
}
