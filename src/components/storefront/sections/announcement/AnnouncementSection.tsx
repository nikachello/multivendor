import { AnnouncementSectionProps } from "@/lib/types/sections";
import Link from "next/link";

const AnnouncementSection = ({
  text,
  link,
  linkText,
}: AnnouncementSectionProps) => {
  return (
    <div
      className="w-full py-2 px-4 text-center text-sm"
      style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}
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
