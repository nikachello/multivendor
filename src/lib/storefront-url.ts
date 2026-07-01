const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Returns the public storefront URL for a shop slug.
 *  Production: https://slug.multistore.ge
 *  Dev:        /shop/slug  (path-based, no subdomain needed)
 */
export function getStorefrontUrl(slug: string): string {
  return APP_URL.startsWith("https://")
    ? `https://${slug}.${ROOT_DOMAIN}`
    : `/shop/${slug}`;
}
