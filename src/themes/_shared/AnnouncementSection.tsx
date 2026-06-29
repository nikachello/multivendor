import Link from "next/link";
import type { ThemeConfig } from "@/themes/types";
import type { AnnouncementSectionProps } from "@/lib/types/sections";

type Props = AnnouncementSectionProps & { themeConfig: ThemeConfig };

const AnnouncementSection = ({ text, link, linkText, themeConfig }: Props) => {
  return (
    <div
      className={themeConfig.sections.announcement.wrapper}
      style={{ backgroundColor: "var(--primary)", color: "var(--secondary)" }}
    >
      {text}
      {link && linkText && (
        <>
          {" "}
          <Link
            href={link}
            className="underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            {linkText}
          </Link>
        </>
      )}
    </div>
  );
};

export default AnnouncementSection;
