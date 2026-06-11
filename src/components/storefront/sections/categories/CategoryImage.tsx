"use client";
import { useState } from "react";
import Image from "next/image";
import { Category } from "@/generated/prisma/client";

export default function CategoryImage({ category }: { category: Category }) {
  const [error, setError] = useState(false);

  if (error || !category.image) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        No image
      </div>
    );
  }

  return (
    <Image
      src={category.image}
      alt={category.name}
      fill
      className="object-cover"
      onError={() => setError(true)}
      unoptimized
    />
  );
}
