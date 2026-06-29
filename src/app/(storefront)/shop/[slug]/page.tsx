import { notFound } from "next/navigation";
import { Metadata } from "next";
import Section from "@/components/storefront/layout/Section";
import { getThemeRegistry } from "@/lib/section-registry";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { ShopSection } from "@/lib/types/store-section";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import EditorBridge from "@/components/storefront/EditorBridge";
import { getThemeConfig } from "@/themes";
import { getShopBase } from "@/lib/shop-base";

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
    description: shop.description ?? undefined,
    openGraph: {
      title: shop.name,
      description: shop.description ?? undefined,
      url: `/shop/${slug}`,
      siteName: shop.name,
      type: "website",
    },
    twitter: { card: "summary" },
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
  const hasAnnouncement = sections.some((s) => s.type === "announcement");

  const sectionAfterNavbar =
    navbarIndex !== -1 ? sections[navbarIndex + 1] : null;

  // Disable transparent-over-banner when an announcement bar is also present,
  // because the banner's -mt only accounts for navbar height, not announcement height.
  const hasLeadingBanner = !hasAnnouncement && sectionAfterNavbar?.type === "banner";

  const themeId = (shop as { themeId?: string }).themeId ?? "minimal";
  const registry = getThemeRegistry(themeId);
  const themeConfig = getThemeConfig(themeId);
  const shopBase = await getShopBase(slug);

  return (
    <div className="flex flex-col pb-20 bg-[var(--page-bg)]">
      {sections.map((section) => {
        const Component = registry[section.type] as
          | React.ComponentType<ShopSection["props"]>
          | undefined;

        if (!Component) return null;

        const extraProps = {
          shopId: shop.id,
          shopSlug: shop.slug,
          shopBase,
          shopName: shop.name,
          currency: shop.currency,
          transparent: hasLeadingBanner,
          themeConfig,
        };

        const sectionProps =
          section.type === "navbar"
            ? {
                ...section.props,
                items: resolveNavItems(section.props.items ?? [], shopBase),
              }
            : section.props;

        return (
          <div key={section.id} data-section-id={section.id}>
            <Section container={false}>
              <Component {...sectionProps} {...extraProps} />
            </Section>
          </div>
        );
      })}
      <EditorBridge />
    </div>
  );
}
