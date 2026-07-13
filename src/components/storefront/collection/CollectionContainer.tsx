import Link from "next/link";
import { Category } from "@/generated/prisma/client";
import CollectionItem from "./CollectionItem";
import CollectionFilters from "./CollectionFilters";
import {
  ProductWithRelations,
  CollectionFacets,
  CollectionSortOption,
  CollectionConfig,
} from "@/lib/db/queries";

const PAGE_SIZE = 24;

type Props = {
  category: Category;
  subcategories?: Category[];
  activeSub?: string;
  products: ProductWithRelations[];
  currency: string;
  shopSlug: string;
  shopBase?: string;
  total: number;
  allTotal: number;
  page: number;
  facets: CollectionFacets;
  sort: CollectionSortOption;
  minPrice?: number;
  maxPrice?: number;
  optionFilters: Record<string, string[]>;
  inStockOnly: boolean;
  currentParamsStr: string;
  config: Required<CollectionConfig>;
};

export default function CollectionContainer({
  category,
  subcategories = [],
  activeSub,
  products,
  currency,
  shopSlug,
  shopBase = "",
  total,
  allTotal,
  page,
  facets,
  sort,
  minPrice,
  maxPrice,
  optionFilters,
  inStockOnly,
  currentParamsStr,
  config,
}: Props) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const basePath = `${shopBase}/collections/${category.slug}`;

  function buildSubHref(subSlug: string | null) {
    const params = new URLSearchParams(currentParamsStr);
    params.delete("page");
    if (subSlug) params.set("sub", subSlug);
    else params.delete("sub");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function pageHref(p: number) {
    const params = new URLSearchParams(currentParamsStr);
    if (p === 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  // Show at most 7 page numbers with ellipsis
  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="px-5 md:px-10 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Subcategory chips */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <SubChip
            label="All"
            href={buildSubHref(null)}
            active={!activeSub}
          />
          {subcategories.map((sub) => (
            <SubChip
              key={sub.id}
              label={sub.name}
              href={buildSubHref(sub.slug)}
              active={activeSub === sub.slug}
            />
          ))}
        </div>
      )}

      {/* Filters bar */}
      <CollectionFilters
        facets={facets}
        sort={sort}
        minPrice={minPrice}
        maxPrice={maxPrice}
        optionFilters={optionFilters}
        inStockOnly={inStockOnly}
        total={total}
        allTotal={allTotal}
        currency={currency}
        currentParamsStr={currentParamsStr}
        config={config}
      />

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="py-20 text-center text-neutral-400 text-sm">
          {allTotal === 0
            ? "No products here yet."
            : "No products match your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <CollectionItem
              key={product.id}
              product={product}
              currency={currency}
              shopSlug={shopSlug}
              shopBase={shopBase}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1.5">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              ← Prev
            </Link>
          )}
          {pageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-2 text-xs text-neutral-400">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={pageHref(p)}
                className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                  p === page
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {p}
              </Link>
            ),
          )}
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              className="px-3 py-1.5 text-xs border border-neutral-200 rounded-lg text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function SubChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
      }`}
    >
      {label}
    </Link>
  );
}
