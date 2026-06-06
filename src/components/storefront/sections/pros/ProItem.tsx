import { Pro } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  pro: Pro;
};

const ProItem = ({ pro }: Props) => {
  if (pro.type === "image") {
    return (
      <div className="relative h-[340px] w-full overflow-hidden rounded-3xl">
        <Image
          src={pro.imageUrl || ""}
          alt={pro.title || "Banner"}
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
        <h3 className="text-2xl font-semibold tracking-tight">{pro.title}</h3>

        <p className="leading-7 text-gray-600">{pro.description}</p>

        {pro.buttonText && pro.buttonUrl && (
          <Link
            href={pro.buttonUrl}
            className="inline-flex bg-[#C25447] px-6 py-3 text-sm text-white transition hover:opacity-90"
          >
            {pro.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProItem;
