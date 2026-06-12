import { Highlight } from "@/lib/types/data-types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  item: Highlight;
};

const HighlightItem = ({ item }: Props) => {
  if (item.type === "image") {
    return (
      <div className="relative h-[340px] w-full overflow-hidden rounded-3xl">
        <Image
          src={item.imageUrl || ""}
          alt={item.title || ""}
          fill
          sizes="(max-width: 1280px) 100vw, 340px"
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="flex h-[340px] w-full flex-col items-center justify-center rounded-3xl bg-[#F5D7C7] p-8 text-center">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
        <p className="leading-7 text-gray-600">{item.description}</p>
        {item.buttonText && item.buttonUrl && (
          <Link
            href={item.buttonUrl}
            className="inline-flex bg-[#C25447] px-6 py-3 text-sm text-white transition hover:opacity-90"
          >
            {item.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HighlightItem;
