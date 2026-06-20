"use client";

import React from "react";

type Props = {
  initialUrl: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isLoading: boolean;
  onLoad: () => void;
  viewMode: "desktop" | "mobile";
};

export default function StorefrontPreview({
  initialUrl,
  iframeRef,
  isLoading,
  onLoad,
  viewMode,
}: Props) {
  return (
    <div
      className={`flex-1 overflow-y-auto min-w-0 w-full transition-opacity duration-300 ${
        isLoading ? "opacity-30" : "opacity-100"
      }`}
    >
      <div
        className={
          viewMode === "mobile" ? "max-w-[390px] mx-auto h-full" : "w-full h-full"
        }
      >
        <iframe
          ref={iframeRef}
          src={initialUrl}
          className="w-full h-full border-0"
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
