import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import Section from "@/components/storefront/layout/Section";

import { shops, categories, products } from "@/lib/mock-data";

import { homepageSections } from "@/lib/mock-homepage";
import { sectionRegistry } from "@/lib/section-registry";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = shops.find((s) => s.slug === slug);

  if (!shop) return <div>Shop not found</div>;

  const currency = shop.currency;

  const shopCategories = categories.filter((c) => c.shopId === shop.id);

  const shopProducts = products.filter((p) => p.shopId === shop.id);

  const category = shopCategories[0];

  const collectionProducts = shopProducts.filter(
    (p) => p.categoryId === category.id
  );

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* static section for now */}
      <Section className="pt-10">
        <CollectionContainer
          category={category}
          products={collectionProducts}
          currency={currency}
        />
      </Section>

      {/* dynamic sections */}
      {homepageSections.map((section) => {
        const Component =
          sectionRegistry[section.type as keyof typeof sectionRegistry];

        if (!Component) return null;

        return (
          <Section key={section.id} container={section.type !== "banner"}>
            <Component {...section.props} />
          </Section>
        );
      })}
    </div>
  );
}
