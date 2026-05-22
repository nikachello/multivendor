import { Pro } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  pro: Pro;
};

const ProItem = ({ pro }: Props) => {
  if (pro.type === "image") {
    return (
      <div className="relative w-full xl:w-[340px] h-[340px] overflow-hidden rounded-2xl">
        <Image
          src={pro.imageUrl || ""}
          alt="Banner"
          fill
          sizes="(max-width: 1280px) 100vw, 340px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full xl:w-[340px] h-[340px] rounded-2xl border p-6 shadow-sm bg-white flex flex-col">
      <h3 className="text-2xl font-semibold mb-4">{pro.title}</h3>

      <p className="text-gray-600 leading-7">{pro.description}</p>

      {pro.buttonText && pro.buttonUrl && (
        <Link
          href={pro.buttonUrl}
          className="mt-auto inline-flex items-center rounded-lg bg-black text-white px-5 py-3 w-fit"
        >
          {pro.buttonText}
        </Link>
      )}
    </div>
  );
};

export default ProItem;
