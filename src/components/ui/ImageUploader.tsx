"use client";

import { useCallback, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

type Props = {
  onUploadComplete: (urls: string[]) => void;
  endpoint?: keyof OurFileRouter;
  maxFiles?: number;
};

export default function ImageUploader({ onUploadComplete, endpoint = "productImage", maxFiles = 8 }: Props) {
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const urls = res.map((r) => r.ufsUrl);
      onUploadComplete(urls);
    },
    onUploadError: (err) => {
      console.error(err);
    },
  });

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      const objectUrls = files.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...objectUrls]);
      await startUpload(files);
    },
    [startUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      handleFiles(files);
    },
    [handleFiles],
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      handleFiles(files);
      e.target.value = "";
    },
    [handleFiles],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded px-6 py-10 cursor-pointer transition-colors ${
          dragging ? "border-gray-400 bg-gray-50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInput}
        />
        {isUploading ? (
          <p className="text-sm text-gray-400">Uploading...</p>
        ) : (
          <>
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-gray-500">Drag & drop or <span className="underline">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">Up to {maxFiles} images, 4MB each</p>
          </>
        )}
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="w-20 h-20 object-cover rounded border border-gray-200"
            />
          ))}
        </div>
      )}
    </div>
  );
}
