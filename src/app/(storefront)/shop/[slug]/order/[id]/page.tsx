import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/db/queries";
import { getShopBySlug, getShopSections } from "@/lib/db/queries";
import { getThemeRegistry } from "@/lib/section-registry";
import { NavbarSectionProps } from "@/lib/types/sections";
import { resolveNavItems } from "@/lib/navigation/resolve-nav-items";
import { getShopBase } from "@/lib/shop-base";
import CartCleaner from "@/components/storefront/cart/CartCleaner";
import TrackOnMount from "@/components/storefront/tracking/TrackOnMount";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getShopBySlug(slug);
  if (!result.ok) return { title: "Not Found" };
  return {
    title: `Order confirmed — ${result.data.name}`,
    robots: { index: false },
  };
}

type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local[0]}***@${domain}`;
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const [shopResult, orderResult] = await Promise.all([
    getShopBySlug(slug),
    getOrderById(id),
  ]);

  if (!shopResult.ok || !orderResult.ok) notFound();

  const shop = shopResult.data;
  const order = orderResult.data;

  if (order.shopId !== shop.id) notFound();

  const shopBase = await getShopBase(slug);
  const sectionsResult = await getShopSections(shop.id);
  const sections = sectionsResult.ok ? sectionsResult.data : [];
  const navbarSection = sections.find((s) => s.type === "navbar");
  const registry = getThemeRegistry(
    (shop as { themeId?: string }).themeId ?? "minimal",
  );
  const NavbarComponent = registry["navbar"] as React.ComponentType<
    NavbarSectionProps & {
      shopId?: string;
      shopSlug?: string;
      shopName?: string;
      transparent?: boolean;
    }
  >;

  const address = order.shippingAddress as ShippingAddress;
  const firstName = address.name?.split(" ")[0] ?? "";

  return (
    <>
      <CartCleaner shopId={shop.id} />
      <TrackOnMount
        event="Purchase"
        orderId={order.id}
        value={Number(order.total)}
        currency={shop.currency}
        items={order.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: Number(item.price),
          quantity: item.quantity,
        }))}
        googleAdsConversionTarget={
          shop.googleAdsId && shop.googleAdsConversionLabel
            ? `${shop.googleAdsId}/${shop.googleAdsConversionLabel}`
            : undefined
        }
      />
      {navbarSection && NavbarComponent && (
        <NavbarComponent
          {...(navbarSection.props as NavbarSectionProps)}
          items={resolveNavItems(
            (navbarSection.props as NavbarSectionProps).items ?? [],
            shopBase,
          )}
          shopId={shop.id}
          shopSlug={shop.slug}
          shopBase={shopBase}
          shopName={shop.name}
          transparent={false}
        />
      )}

      <div className="px-5 md:px-10 py-16 max-w-2xl mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <svg
              className="w-7 h-7 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order confirmed!
          </h1>
          <p className="mt-2 text-neutral-500 text-sm max-w-sm">
            Thank you{firstName ? `, ${firstName}` : ""}. We&apos;ll send a
            confirmation to{" "}
            <span className="text-neutral-800">
              {maskEmail(order.customerEmail!)}
            </span>{" "}
            shortly.
          </p>
          <p className="mt-3 text-xs text-neutral-400 font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Items */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            Items ordered
          </h2>
          <ul className="divide-y divide-neutral-100 border border-neutral-100 rounded">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                <div className="relative w-14 h-14 flex-shrink-0 bg-neutral-100 overflow-hidden rounded">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {item.productName}
                  </p>
                  {Object.values(item.variantOptions as Record<string, string>)
                    .length > 0 && (
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {Object.values(
                        item.variantOptions as Record<string, string>,
                      ).join(" · ")}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-neutral-900 whitespace-nowrap">
                  {shop.currency}{" "}
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-4 px-1">
            <span>Total</span>
            <span>
              {shop.currency} {Number(order.total).toFixed(2)}
            </span>
          </div>
        </section>

        {/* Shipping address */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
            Shipping to
          </h2>
          <div className="text-sm text-neutral-600 space-y-0.5">
            <p>{[address.city, address.country].filter(Boolean).join(", ")}</p>
          </div>
        </section>

        <Link
          href={shopBase || "/"}
          className="inline-block px-8 py-3 text-sm tracking-widest uppercase bg-black text-white hover:opacity-80 transition-opacity"
        >
          Continue shopping
        </Link>
      </div>
    </>
  );
}
