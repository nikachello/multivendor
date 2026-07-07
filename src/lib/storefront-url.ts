const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://multistore.ge";

/** Returns the public storefront URL for a shop slug.
 *  Production: https://slug.multistore.ge
 *  Dev:        /shop/slug  (path-based, no subdomain needed)
 */
export function getStorefrontUrl(slug: string): string {
  return APP_URL.startsWith("https://")
    ? `https://${slug}.${ROOT_DOMAIN}`
    : `/shop/${slug}`;
}

/** Canonical public URL for a shop, honoring a verified custom domain. */
export function getCanonicalShopUrl(
  shop: { slug: string; customDomain?: string | null; domainVerified?: boolean },
  path: string = "",
): string {
  const base =
    shop.customDomain && shop.domainVerified
      ? `https://${shop.customDomain}`
      : getStorefrontUrl(shop.slug);
  return `${base}${path}`;
}

/** Always-absolute canonical URL — for contexts (sitemaps) that can't resolve
 *  a relative URL against metadataBase. Falls back to APP_URL + path in dev. */
export function getAbsoluteCanonicalShopUrl(
  shop: { slug: string; customDomain?: string | null; domainVerified?: boolean },
  path: string = "",
): string {
  if (shop.customDomain && shop.domainVerified) return `https://${shop.customDomain}${path}`;
  return APP_URL.startsWith("https://")
    ? `https://${shop.slug}.${ROOT_DOMAIN}${path}`
    : `${APP_URL}/shop/${shop.slug}${path}`;
}
