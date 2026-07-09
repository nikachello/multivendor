import Image from "next/image";
import Link from "next/link";

type SocialLink = { platform: "instagram" | "tiktok" | "youtube" | "twitter" | "whatsapp"; url: string };

type Props = {
  variant?: "personal" | "brand";
  image?: string;
  name?: string;
  bio?: string;
  locationBadge?: string;
  socialLinks?: SocialLink[];
  shopName?: string;
};

const ICONS: Record<string, string> = {
  instagram: "IG",
  tiktok: "TT",
  youtube: "YT",
  twitter: "X",
  whatsapp: "WA",
};

export default function CreatorProfile({
  variant = "personal",
  image,
  name,
  bio,
  locationBadge,
  socialLinks = [],
  shopName = "",
}: Props) {
  const displayName = name || shopName;

  return (
    <section
      className="flex flex-col items-center gap-4 px-5 pt-12 pb-8 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {/* Avatar / Logo */}
      <div className="relative">
        {image ? (
          <div
            className={
              variant === "brand"
                ? "w-24 h-24 rounded-2xl overflow-hidden bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] p-3 flex items-center justify-center"
                : "w-24 h-24 rounded-full overflow-hidden ring-2 ring-[var(--creator-subtle)]"
            }
          >
            <Image
              src={image}
              alt={displayName}
              width={96}
              height={96}
              className={
                variant === "brand"
                  ? "object-contain w-full h-full"
                  : "object-cover w-full h-full"
              }
            />
          </div>
        ) : (
          <div
            className={
              variant === "brand"
                ? "w-24 h-24 rounded-2xl bg-[var(--creator-surface)] ring-1 ring-[var(--creator-subtle)] flex items-center justify-center"
                : "w-24 h-24 rounded-full bg-[var(--creator-subtle)] flex items-center justify-center"
            }
          >
            <span className="text-2xl font-bold text-[var(--creator-muted)]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {locationBadge && (
          <div className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-[var(--creator-surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--creator-muted)] ring-1 ring-[var(--creator-subtle)]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {locationBadge}
          </div>
        )}
      </div>

      {/* Name */}
      <h1
        className="text-2xl font-semibold tracking-tight text-center text-[var(--creator-on-surface)]"
        style={{ fontFamily: "var(--creator-display-font)" }}
      >
        {displayName}
      </h1>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-[var(--creator-muted)] text-center max-w-xs leading-relaxed">
          {bio}
        </p>
      )}

      {/* Social icons */}
      {socialLinks.length > 0 && (
        <div className="flex items-center gap-3 mt-1">
          {socialLinks.map((sl) => (
            <Link
              key={sl.platform}
              href={sl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--creator-surface)] text-[var(--creator-muted)] hover:text-[var(--primary)] hover:bg-[var(--creator-subtle)] transition-colors text-xs font-semibold"
              aria-label={sl.platform}
            >
              {ICONS[sl.platform] ?? sl.platform.slice(0, 2).toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
