"use client";

import { useRouter, usePathname } from "next/navigation";

const RANGES = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
];

export default function DateRangePicker({ current }: { current: number }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border border-gray-200 rounded-lg p-0.5 bg-white">
      {RANGES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() =>
            router.replace(value === 30 ? pathname : `${pathname}?days=${value}`)
          }
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            current === value
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
