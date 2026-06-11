"use server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Section from "@/components/storefront/layout/Section";
import { sectionRegistry } from "@/lib/section-registry";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { ShopSection } from "@/lib/types/store-section";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import EditorBridge from "@/components/storefront/EditorBridge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return { title: "Not Found" };
  const shop = result.data;
  return {
    title: shop.name,
    description: shop.description,
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shopResult = await getShopBySlug(slug);
  if (!shopResult.ok) notFound();
  const shop = shopResult.data;

  const sectionsResult = await getShopSections(shop.id);

  if (!sectionsResult.ok) {
    return null; // or fallback UI TODO
  }

  const sections = sectionsResult.data;

  // -------------------------
  // NAVBAR LOGIC
  // -------------------------
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
          shopSlug: shop.slug,
          shopName: shop.name,
          currency: shop.currency,
          transparent: hasLeadingBanner,
        };

        const sectionProps =
          section.type === "navbar"
            ? {
                ...section.props,
                items: resolveNavItems(section.props.items ?? [], shop.slug),
              }
            : section.props;

        return (
          <div key={section.id} data-section-id={section.id}>
            <Section
              container={
                section.type !== "banner" &&
                section.type !== "announcement" &&
                section.type !== "navbar" &&
                section.type !== "testimonials"
              }
            >
              <Component {...sectionProps} {...extraProps} />
            </Section>
          </div>
        );
      })}
      <EditorBridge />
    </div>
  );
}
