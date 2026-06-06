import { notFound } from "next/navigation";
import Section from "@/components/storefront/layout/Section";
import { sectionRegistry } from "@/lib/section-registry";
import { getShopBySlug, getShopSections } from "@/lib/data/queries";
import { ShopSection } from "@/lib/types/store-section";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shop = getShopBySlug(slug);
  if (!shop) notFound();

  const sections = getShopSections(shop.id);

  const navbarIndex = sections.findIndex((s) => s.type === "navbar");
  const sectionAfterNavbar =
    navbarIndex !== -1 ? sections[navbarIndex + 1] : null;
  const hasLeadingBanner = sectionAfterNavbar?.type === "banner";

  return (
    <div className="flex flex-col pb-20">
      {sections.map((section) => {
        const Component = sectionRegistry[section.type] as React.ComponentType<
          ShopSection["props"]
        >;

        const extraProps = {
          shopId: shop.id,
          currency: shop.currency,
          // only NavbarSection uses this, others ignore it
          transparent: hasLeadingBanner,
        };

        return (
          <Section
            key={section.id}
            container={
              section.type !== "banner" &&
              section.type !== "announcement" &&
              section.type !== "navbar" &&
              section.type !== "testimonials"
            }
          >
            <Component {...section.props} {...extraProps} />
          </Section>
        );
      })}
    </div>
  );
}
