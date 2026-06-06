import { AnnouncementSectionProps } from "@/lib/types/sections";
import Link from "next/link";

const AnnouncementSection = ({
  text,
  bgColor = "#F5D7C7",
  textColor = "#000000",
  link,
  linkText,
}: AnnouncementSectionProps) => {
  return (
    <div
      className="w-full py-2 px-4 text-center text-sm z-[15000]"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
      {link && linkText && (
        <>
          {" "}
          <Link href={link} className="underline underline-offset-4">
            {linkText}
          </Link>
        </>
      )}
    </div>
  );
};

export default AnnouncementSection;
