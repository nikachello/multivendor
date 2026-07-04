import Link from "next/link";

function pageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) pages.push(p);
  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);
  return pages;
}

type Props = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

export default function DashboardPagination({ page, totalPages, searchParams }: Props) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") params.set(k, Array.isArray(v) ? v[0] : v);
    }
    if (p > 1) params.set("page", String(p));
    const str = params.toString();
    return str ? `?${str}` : "?";
  }

  const base = "px-3 py-1.5 text-sm rounded-lg border transition-colors";
  const active = "bg-gray-900 text-white border-gray-900";
  const inactive = "text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900 bg-white";
  const disabled = "text-gray-300 border-gray-100 bg-white cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${base} ${inactive}`}>←</Link>
      ) : (
        <span className={`${base} ${disabled}`}>←</span>
      )}

      {pageNumbers(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-2 py-1.5 text-sm text-gray-400">…</span>
        ) : (
          <Link key={p} href={href(p)} className={`${base} ${p === page ? active : inactive}`}>
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${base} ${inactive}`}>→</Link>
      ) : (
        <span className={`${base} ${disabled}`}>→</span>
      )}
    </div>
  );
}
