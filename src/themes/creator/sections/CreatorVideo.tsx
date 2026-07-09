type Props = {
  url?: string;
  title?: string;
  description?: string;
};

function resolveEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;

  return null;
}

export default function CreatorVideo({ url = "", title, description }: Props) {
  const embedUrl = resolveEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title ?? "Video"}
        />
      </div>
      {title && (
        <p className="text-base font-semibold text-[var(--creator-on-surface)] mt-3">{title}</p>
      )}
      {description && (
        <p className="text-sm text-[var(--creator-muted)] mt-1 leading-relaxed">{description}</p>
      )}
    </section>
  );
}
