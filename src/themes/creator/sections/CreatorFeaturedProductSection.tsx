import { getProductById } from "@/lib/db/queries";
import CreatorFeaturedProductClient from "./CreatorFeaturedProduct";

type Props = {
  productId?: string;
  badge?: string;
  ctaLabel?: string;
  shopId?: string;
  shopBase?: string;
  currency?: string;
};

export default async function CreatorFeaturedProductSection({
  productId,
  badge,
  ctaLabel,
  shopId = "",
  shopBase = "",
  currency = "USD",
}: Props) {
  if (!productId) return null;

  const result = await getProductById(productId);
  if (!result.ok) return null;

  const product = result.data;

  return (
    <section
      className="px-5 py-6 max-w-[600px] mx-auto w-full"
      style={{ fontFamily: "var(--creator-body-font)" }}
    >
      <CreatorFeaturedProductClient
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          images: product.images,
          variants: product.variants.map((v) => ({
            id: v.id,
            price: v.price,
            stock: v.stock,
            trackInventory: v.trackInventory,
          })),
        }}
        badge={badge}
        ctaLabel={ctaLabel}
        shopId={shopId}
        shopBase={shopBase}
        currency={currency}
      />
    </section>
  );
}
