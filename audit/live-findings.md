# Live-site audit findings (multistore.ge) — captured via Chrome + curl

## Security (live, confirmed)
- **No security headers on ANY host** (apex + subdomain). curl shows only `cache-control`, `content-type`, `server: Vercel`. Missing: HSTS, CSP, X-Frame-Options (clickjacking), X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Confirms next.config.ts has no headers().
- Auth guard works: `/dashboard`, `/admin`, `/admin/overview` → 307 redirect to `/login` unauthenticated.
- BOG webhook: `GET /api/bog-callback` → 405; `POST` without signature → 401 (rejects unsigned). Signature enforcement present at the missing-signature level.
- Nonexistent subdomain (`nonexistent-xyz123.multistore.ge`) → 404 clean (no crash/info leak).

## SEO (live, confirmed)
- **`<html lang="en">` on a fully Georgian site** — every page (landing, storefront, product, checkout). a11y + SEO defect. Systemic (root layout).
- **No `<link rel="canonical">` on ANY page** (landing, storefront, product).
- **Duplicate content**: `https://multistore.ge/shop/zari` (200) AND `https://zari.multistore.ge/` (200) both serve the same store. No canonical to consolidate.
- **`og:url` points to apex path** (`https://multistore.ge/shop/zari...`) even when served on the subdomain the user is on — reinforces duplicate-content split.
- **sitemap.xml uses RELATIVE `<loc>` URLs** (`/shop/zari` not absolute `https://...`) — INVALID per sitemap protocol; also `Sitemap: /sitemap.xml` in robots.txt is relative. Sitemap lists only the demo shop (zari), not per-tenant.
- **Landing page**: English title ("MultiStore — Build your online store") + English meta description ("The multi vendor ecommerce platform") on Georgian marketing page. No OG, no Twitter, no JSON-LD (no Organization/WebSite/SoftwareApplication schema).
- **Product page**: HAS Product JSON-LD incl. Offer (GOOD). But `og:type=website` (should be `product`). Storefront home has OG but no JSON-LD ItemList.
- robots.txt: allows /shop/, disallows /editor and /api/. Dashboard/admin/login not disallowed (minor).

## Accessibility (live, confirmed)
- **Checkout: ALL 8 form fields lack programmatic labels** (no id+htmlFor, no aria-label, no wrapping label; fields have no id/name). Visible "Full name"/"Email"/etc are unassociated text. Screen readers announce unlabeled edit fields. **Prior QA_REPORT.md finding #4 is STILL live/unfixed.**
- **Checkout: no `autocomplete` attributes** on any field (name/email/tel/street-address) — WCAG 1.3.5 + autofill UX loss.
- Product page: 4 buttons without accessible names (icon buttons: search, cart, quantity +/-).
- Storefront images DO have Georgian alt text (good). Landing has no images.

## Performance (live)
- Storefront home: **load event ~6.6s**, DOMContentLoaded ~2.45s, TTFB 178ms (Vercel edge ok). 13 script resources, 38 total resources, **~1.2MB transferred**. Heavy JS for a storefront.
- Product images are raw Unsplash `<img>` at w=600 (demo data), lazy-loaded. Real stores use uploadthing; next.config only whitelists images.unsplash.com → next/image likely bypassed (raw <img>), matches eslint no-img-element x5.

## UX / content / localization (live)
- **Mixed-language UI**: storefront theme chrome is hardcoded English ("YOUR CART", "CHECKOUT", "Subtotal", "Remove", "QUANTITY", "ADD TO CART", "DESCRIPTION", "SKU", "ORDER SUMMARY", "SHOP", "INFO") on a Georgian merchant store.
- **Checkout entirely in English** ("Checkout", "Full name", "Email", "Phone", "Shipping address", "City", "Select city…", "Delivery note", "Discount code", "Apply", "Payment", "Total") — Georgian shoppers see an English checkout. Conversion risk.
- Landing marketing copy is Georgian and clean; product pages localized well. The English UI chrome is the gap.

## Notes
- No order was placed; cart is client-side only. Non-destructive throughout.
- Deep IDOR/tenant-isolation left to source audit (needs two tenants + real order IDs; not probed on prod).
