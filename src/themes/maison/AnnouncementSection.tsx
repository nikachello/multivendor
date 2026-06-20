import { AnnouncementSectionProps } from "@/lib/types/sections";
import Link from "next/link";

const AnnouncementSection = ({ text, link, linkText }: AnnouncementSectionProps) => {
  return (
    <div className="w-full py-2.5 px-4 text-center text-[11px] tracking-[0.18em] uppercase" style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}>
      {text}
      {link && linkText && (
        <>
          {" "}
          <Link href={link} className="underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">
            {linkText}
          </Link>
        </>
      )}
    </div>
  );
};

export default AnnouncementSection;
