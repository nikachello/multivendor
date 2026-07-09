import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory, getProductsByShop } from "@/lib/db/queries";

type Props = {
  title?: string;
  categoryId?: string;
  limit?: number;
  shopId?: string;
  shopBase?: string;
  currency?: string;
};

export default async function CreatorProductGrid({
  title = "Shop",
  categoryId,
  limit = 6,
  shopId = "",
  shopBase = "",
  currency = "USD",
}: Props) {
  if (!shopId) return null;

  let products: { id: string; name: string; slug: string; images: { url: string; isMain: boolean }[]; variants: { price: number }[] }[] = [];

  if (categoryId) {
    const result = await getProductsByCategory(shopId, categoryId);
    if (result.ok) products = result.data;
  } else {
    const result = await getProductsByShop(shopId, { pageSize: limit });
    if (result.ok) products = result.data.data;
  }

  const visible = products.slice(0, limit);
  if (visible.length === 0) return null;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--creator-muted)] mb-3">
          {title}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {visible.map((product) => {
          const mainImage = product.images.find((i) => i.isMain) ?? product.images[0];
          const price = Math.min(...product.variants.map((v) => v.price));
          return (
            <Link
              key={product.id}
              href={`${shopBase}/product/${product.slug}`}
              className="flex flex-col gap-2 rounded-2xl bg-[var(--creator-surface)] p-2 ring-1 ring-[var(--creator-subtle)] active:scale-[0.98] transition-transform"
            >
              <div className="relative w-full rounded-xl overflow-hidden bg-[var(--creator-subtle)]" style={{ aspectRatio: "1/1" }}>
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--creator-subtle)]" />
                )}
              </div>
              <p className="text-sm font-medium text-[var(--creator-on-surface)] truncate px-1">
                {product.name}
              </p>
              <p className="text-sm font-semibold text-[var(--creator-on-surface)] px-1 pb-1">
                {currency} {price.toFixed(2)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
