# MultiStore — Full Audit Report

**Target:** https://multistore.ge (live) + https://github.com/nikachello/multivendor (`main` @ `bedbef0`)
**Reviewed:** 2026-07-05
**What it is:** A Shopify-style multi-tenant store builder for Georgian merchants. Next.js 16.2.6 (App Router) · React 19.2 · TypeScript · Prisma 7.8/Postgres · better-auth · uploadthing · Resend · Bank-of-Georgia (BOG) payments · Tailwind 4 · dnd-kit visual editor. 20-model schema, 14 server-action modules, subdomain + custom-domain routing.

**How this was produced:** ground-truth build/lint/audit runs on a fresh clone, a 37-agent multi-perspective code audit, live-site probing (Chrome + curl), and manual re-verification of every Critical/High security finding directly against the source. Findings marked **[verified]** were confirmed by reading the actual code line; a few noisy auto-verifier verdicts were overridden after manual check (noted inline).

---

## Verdict

**Overall grade: C‑ (functional and well-built in parts, but has ship‑blocking security defects for a live payments product).**

The product is real and the hard parts are often done well: the checkout path is genuinely solid (server-side price re-computation, cross-shop variant guard, atomic conditional stock decrement in a transaction), metadata hygiene is decent, TypeScript strict is on, and error boundaries exist. **But** it currently ships:

- **1 Critical:** anyone on the internet can register as a **platform admin**.
- **~13 High:** multiple confirmed cross-tenant IDORs, two stored-XSS vectors on public storefronts, an unauthenticated file-upload endpoint, **silently-broken subscription billing**, no security headers, and duplicate-content SEO that will suppress every merchant's rankings.
- Plus ~24 Medium and ~20 Low (performance, accessibility, correctness, DevOps).

The root cause of most security issues is one architectural gap: **server actions trust a client-supplied `shopId` instead of deriving the shop from the session**, and there is no shared auth+validate wrapper — so the tenant check is a hand-copied convention that some actions simply forgot. Fix that pattern once and ~5 of the High findings collapse together.

**Do not treat this as production-safe for real merchant/customer/payment data until the Critical + Security-High items below are fixed.**

### Severity tally

| Severity | Count | Theme concentration |
|---|---|---|
| Critical | 1 | Auth privilege escalation |
| High | 13 | Tenant isolation (IDOR), XSS, uploads, payments, headers, SEO, perf |
| Medium | ~24 | Perf/data-layer, accessibility, correctness, DevOps |
| Low | ~20 | Cleanup, hardening, minor a11y/SEO |

### Dimension grades

| Dimension | Grade |
|---|---|
| Multi-tenant isolation / authorization | **D** (Critical + multiple IDORs) |
| Authentication & session | **D** |
| Payments & billing (BOG) | **D** |
| Injection / XSS / input validation | **D** |
| Correctness & concurrency | **C** |
| Performance & data layer | **C** |
| SEO | **C** |
| Accessibility (WCAG) | **D** |
| Code quality / architecture | **C** |
| Dependencies / build / DevOps | **D** |

---

## Ground-truth evidence (run on the clone)

- `tsc --noEmit`: **0 errors** (clean).
- `eslint`: **54 problems (25 errors, 29 warnings)** — build does not run eslint, so these never gate a deploy. Top: unused-vars ×16, `react/no-unescaped-entities` ×12, `@next/next/no-img-element` ×5, `react-hooks/set-state-in-effect` ×4, `react-hooks/static-components` ×4.
- `next build`: **compiles**, then **fails page-data collection for `/admin/orders`** because a Resend client is constructed at module load and throws when `RESEND_API_KEY` is unset.
- `npm audit`: **14 vulns (5 high, 7 moderate, 2 low)**.
- Live headers (curl, apex + subdomain): **no security headers at all** (only `cache-control`, `content-type`, `server: Vercel`).

---

## CRITICAL — fix immediately

### C1. Anyone can register as a platform admin (mass assignment on sign-up) [verified]
**File:** `src/lib/auth/index.ts:49-55`
The better-auth config declares the `role` field as user input:
```ts
additionalFields: { role: { type: "string", defaultValue: "seller", input: true } }
```
`input: true` means the client can send `role` in the sign-up body, and it is persisted. `assertAdmin` (`src/lib/auth/assert-admin.ts:8`) authorizes purely on `session.user.role === "admin"`, and the `Role` enum includes `admin` (`prisma/schema.prisma:408`). Nothing ever resets/validates the role after signup.
**Exploit:** `POST /api/auth/sign-up/email` with `{ name, email, password, role: "admin" }` → verify your own email → log in with full `/admin/*` access to **every shop, user, and order on the platform**. (Email verification is required, but the attacker owns the mailbox, so it's a trivial extra step.)
**Fix:** Set `input: false` on `role`. Assign/change roles only via a trusted server action already gated by `assertAdmin`. Add a DB/`databaseHooks.user.create.before` hook forcing non-privileged roles on self-serve signup. **Audit existing `User` rows for any `role: "admin"`/unexpected roles created via the API.**

---

## HIGH

### Tenant isolation — the recurring class (all [verified] by direct read)

The safe pattern already exists in most actions (`assertOwnsShop(shopId)` / session-derived shop via `getShop()` in `billing.ts`). These actions forgot it or check the wrong thing:

**H1. `saveTheme` — no ownership check at all → any shop's storefront can be defaced.**
`src/lib/actions/theme.ts:15-23`. `saveTheme(shopId, theme)` checks only `if (!shopId)` then `prisma.shop.update({ where: { id: shopId }, data: theme })`. It's a `"use server"` RPC, so it's a public POST — pass any `shopId` to overwrite that shop's colors/fonts/background. Also returns `undefined` instead of `ok()`.
**Fix:** `await assertOwnsShop(shopId)` (throws → map to 403) before the update; `return ok(null)`.

**H2. `updateOrderStatus` — trusts client `shopId` → cross-tenant order tampering.**
`src/lib/actions/order.ts:204-246`. Signature `(orderId, status, shopId)`; the only guard is `existing.shopId !== shopId` (line 222) — comparing two client-supplied values. No `assertOwnsShop`/`getSession` in the function. An attacker who learns a victim `orderId`+`shopId` can flip order status (triggering **stock restoration** and a **customer-facing status email** on a shop they don't own).
**Fix:** derive `shopId` from the session (`const { id: shopId } = await getShop()`), or `await assertOwnsShop(shopId)` as the first statement.

**H3. `updateVariants` — authorizes only the first array element, writes all IDs unscoped.**
`src/lib/actions/variants.ts:122-140`. `const shopId = await shopIdForVariant(updates[0].id); await assertOwnsShop(shopId)` — then loops `updates.map(u => prisma.variant.update({ where: { id: u.id }, ... }))` with no per-item scope. Craft `updates = [myVariant, victimVariant]` → overwrite **any merchant's** price/stock/SKU (set a rival's price to 0).
**Fix:** resolve the shop for **every** id, assert all belong to the caller's shop, and scope each write: `prisma.variant.updateMany({ where: { id: u.id, product: { shopId } }, data })`. Wrap in `$transaction`.

**H4. `getCouponsByShop` — cross-tenant read, no auth.**
`src/lib/actions/coupons.ts:9`. Runs `prisma.coupon.findMany({ where: { shopId } })` and returns them; the file's first `assertOwnsShop` is only inside `createCoupon`. Any caller enumerates another merchant's codes/discounts/usage/expiry.
**Fix:** `await assertOwnsShop(shopId)` before the `findMany`.

> **Root-cause fix (do this too):** introduce one `shopAction(schema, handler)` wrapper that resolves the shop from the session and validates input, then migrate all 14 action files onto it. This kills the whole IDOR class and prevents the next forgotten copy. `analytics.ts` `recordEvent(shopId, …)` is intentionally public (storefront tracking) but also trusts client `shopId`+`value` — see M-block for the analytics-integrity note.

### Injection / XSS (all [verified] — the auto-verifier wrongly refuted these; sinks confirmed present)

**H5. Stored XSS via unvalidated analytics IDs injected into inline `<script>`.**
`src/components/storefront/tracking/StorefrontGA4.tsx:24-29` renders `gtag('config', '${measurementId}')` inside `dangerouslySetInnerHTML`; same in `StorefrontGoogleAds.tsx:17` and `StorefrontPixel.tsx:20`. `measurementId`/`pixelId`/`googleAdsId` come from `shop.*`, set by `updateShop` (`src/lib/actions/shop.ts:52-71`) **with no format validation** (confirmed: `metaPixelId: data.metaPixelId || null`, etc.). A merchant sets `ga4MeasurementId` to `');<payload>//` → arbitrary JS on **every shopper's** page (persistent stored XSS on `*.multistore.ge`/custom domains).
**Fix:** validate server-side in `updateShop` — GA4 `^G-[A-Z0-9]{4,12}$`, Ads `^AW-\d{6,12}$`, Pixel `^\d{10,20}$`; reject otherwise. Don't build the script via string interpolation.

**H6. Stored XSS via product JSON-LD not escaping `</script>`.**
`src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx:108-109`: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` where `jsonLd.name`/`description` are merchant-controlled and unsanitized (`products.ts` doesn't enforce `productSchema`). `JSON.stringify` does not escape `<`, so a product name `</script><script>…</script>` breaks out.
**Fix:** escape before embedding — `JSON.stringify(x).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')` (shared `safeJsonLd()` helper). Also enforce `productSchema` server-side.

**H7. Uploadthing accepts uploads from unauthenticated, un-scoped callers.**
`src/lib/uploadthing.ts:7,12,17` — all three routes use `.middleware(() => ({ uploadedAt: Date.now() }))` with **no session check and no shop scoping**. Anyone can `POST /api/uploadthing` and upload to the platform's uploadthing account (storage/billing abuse; arbitrary attacker content on the app's CDN; SVG can carry script).
**Fix:** in each middleware require a session (`throw new UploadThingError('Unauthorized')` if none) and return `{ userId, shopId }` after `assertOwnsShop`. Reject non-image MIME; consider blocking SVG.

**H8. Server actions trust raw arguments — 13 of 14 action files do no schema validation.**
Only `order.ts` uses zod. `src/lib/validators/{product,category}.ts` exist but are **never imported by the server actions**. This is the root enabler of H5/H6 and lets unbounded/garbage data into the DB.
**Fix:** `safeParse` a zod schema at the top of every action (mirror `order.ts`), enforcing the analytics-ID regexes and max lengths.

### Payments (BOG) — [verified] by direct read + Node repro

**H9. Subscription billing is silently broken — no paying merchant can ever become Pro.**
`src/lib/bog.ts:95`: `crypto.createVerify("SHA256withRSA")`. "SHA256withRSA" is a Java/JCA name; Node throws `Invalid digest` (reproduced on this machine — Node needs `"RSA-SHA256"`). The throw is swallowed by `catch { return false }`, so `verifyBogCallback` returns **false for every callback** → `bog-callback` 401s every real BOG notification → `subscriptionPaidUntil` never set. The merchant pays and never gets Pro, invisibly (looks like a signature mismatch in logs).
**Fix:** `crypto.createVerify("RSA-SHA256")`. Distinguish a config/parse error (log + 500) from a real signature mismatch (401) so this can't hide again; add a boot-time self-test against a known BOG sample.

**H10. BOG callback has no idempotency/replay protection and no amount check (latent — goes live the moment H9 is fixed).**
`src/app/api/bog-callback/route.ts:42-49` sets `subscriptionPaidUntil = now + 30 days` on any accepted `sub_<shopId>` callback: no dedup on a BOG payment id, no amount/currency validation, and it ignores the existing expiry (early renewal silently loses remaining days). Once H9 is fixed, one captured valid signed callback can be replayed monthly for a permanent free subscription.
**Fix:** persist the BOG payment/order id and reject repeats; verify `currency === 'GEL'` and `amount >= 29`; cross-verify via BOG's `GET /orders/{id}`; extend from `max(now, currentExpiry) + 30d`.

### Platform hardening & discoverability

**H11. No HTTP security headers anywhere (payments app).** [verified live + config]
`next.config.ts` has no `headers()`; live curl on apex + subdomain returns none. Missing CSP, HSTS, X-Frame-Options (clickjacking on checkout/dashboard), X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
**Fix:** add `async headers()` returning HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a CSP allowing `img-src` from `*.ufs.sh utfs.io images.unsplash.com data:` and `connect-src` to `api.bog.ge`.

**H12. No canonical URLs → duplicate content across 3 hosts.** [verified live + code]
Every store renders byte-identical on `multistore.ge/shop/<slug>` (200), `<slug>.multistore.ge` (200), and custom domains, with **zero** `rel=canonical`/`alternates` anywhere. Worse, `og:url` and the sitemap advertise the **apex `/shop/<slug>`** form while the real store is the subdomain. This splits ranking signals for every merchant — the single biggest SEO defect.
**Fix:** add `alternates.canonical` (absolute, via `getStorefrontUrl(slug)`) to every storefront `generateMetadata`; build `og:url` the same way; canonicalize custom-domain shops to their domain.

**H13. Storefront over-fetching + unoptimized images (perf).** [verified]
(a) `FeaturedProductSection.tsx:35` / `minimal/CollectionSection.tsx:32` load the **entire category** (full nested include of images+variants+options) to render 1–4 products, and each section re-runs `getCategoriesByShop`; query fns aren't wrapped in `React.cache`, and `getShopBySlug` runs 3× per request. (b) `next.config.ts` only whitelists `images.unsplash.com`, so all 55/60 storefront `<Image>` are marked `unoptimized` — full-res originals shipped to shoppers (measured live: ~6.6s load, ~1.2MB). This is the conversion-critical path.
**Fix:** add slim `take:N` queries + `getCategoryById`, wrap reads in `React.cache`, add `*.ufs.sh`/`utfs.io` to `remotePatterns` and drop `unoptimized`.

> Also High-ish: **no tests + no CI** on a payments/multi-tenant app (see DevOps block). Given the IDOR/pricing surface, this is a real risk multiplier.

---

## MEDIUM (grouped)

**Auth/session**
- Middleware guard checks cookie **presence only** (`src/proxy.ts:14,53`) — forged/expired cookie passes; API routes excluded from the matcher entirely. OK today because pages re-validate, but fragile — never rely on it for authz.
- `crossSubDomainCookies` shares the platform session cookie across **every** tenant subdomain (`src/lib/auth/index.ts:19`) — broadens blast radius of any storefront XSS/subdomain takeover.
- Account enumeration on register (`src/app/register/page.tsx:76` shows raw "user exists"); login 403 branch reveals valid-but-unverified accounts.

**Correctness / concurrency**
- Coupon usage-limit **TOCTOU** (`order.ts:91→99`): read-then-increment under READ COMMITTED lets `maxUses` be exceeded via concurrent checkouts. Fix with atomic conditional `updateMany` (mirror the stock pattern already used at `order.ts:120`).
- `updateOrderStatus` restores stock **non-transactionally** (`order.ts:227-242`) — concurrent/duplicate transitions double-inflate inventory.
- `updateCoupon` **wipes** `maxUses`/`expiresAt`/`minOrderAmount` to null when only `isActive` is toggled (`coupons.ts:69-71`, `?? null` on undefined). Data loss + turns a capped coupon unlimited.
- Coupon silently dropped at checkout if it just expired → customer charged full price with no notice (`order.ts:82`).

**Performance / data layer**
- `Order` table has **no indexes** beyond PK (`schema.prisma:289`) — every order list/stats/analytics query is a seq scan+sort. Add `@@index([shopId, createdAt])`, `@@index([shopId, status])`; also index `OrderItem.orderId`, `ProductImage.productId`.
- `getCollectionData` loads the whole category then filters/sorts/paginates in JS (`queries.ts:436`).
- Storefront is fully dynamic, **no caching** (`shop-base.ts` `headers()` forces per-request SSR) — wrap reads in `unstable_cache`/`revalidateTag`.
- `generateVariants` does N sequential inserts (`variants.ts:74`); `getAnalyticsData` pulls all events+orders into Node to aggregate in JS (`queries.ts:626`).

**Accessibility (WCAG A/AA)** — [checkout gap verified live]
- Form labels **not associated** across the whole app (only 2 `htmlFor` total; checkout's 8 fields verified live with no id/label/aria and no `autocomplete`). Use `useId()` + `htmlFor`.
- Nav dropdowns keyboard-inaccessible (hover-only `<span>`, no `aria-expanded`); cart drawer is a custom modal with no `role="dialog"`/focus trap/Escape and stays tabbable when closed; product-image reorder has no `KeyboardSensor` (`ImagesEditor.tsx:117` — verified).
- Inline form errors not announced (no `role="alert"`); variant swatches expose no selected state; systemic low contrast (`gray-400`/`*-300` used 300+×); no skip link.

**SEO**
- Sitemap uses **relative `<loc>`** (invalid per spec) and lists only the demo shop; leaks inactive shops/products (no `isActive` filter); `robots.txt` disallows `/editor` (a route that doesn't exist — the editor is `/dashboard/editor`) while leaving `/dashboard` and `/admin` crawlable; product JSON-LD hardcodes `InStock` and omits breadcrumb/sku/brand; collection pages have no `<h1>`; `<html lang="en">` on a Georgian site.

**DevOps / build**
- Build **breaks without `RESEND_API_KEY`** (eager `new Resend()` at module scope — `email.ts:11`); make it lazy.
- `build` runs `prisma migrate deploy` against the live DB on every build (`package.json:7`) — move to a gated release step.
- No env validation (13 raw `process.env` reads with `!`); missing BOG creds send `Basic base64(undefined:undefined)` to BOG.
- npm audit: 14 vulns — **don't** `audit fix --force` (it downgrades next/prisma/uploadthing/better-auth); use `overrides` to patch `hono`/`postcss`/`js-yaml`/`esbuild` forward.
- `images.remotePatterns` is vestigial (only unsplash) while uploads live on `*.ufs.sh`.

**Product / localization** — [verified live]
- The **checkout and all storefront UI chrome are hardcoded English** ("Full name", "Email", "City", "PAYMENT", "YOUR CART", "ADD TO CART", "Subtotal", "Apply") on Georgian stores — a real conversion problem for Georgian shoppers. Localize storefront strings (the merchant marketing copy is already Georgian).

---

## LOW / cleanup

Weak password policy (8-char, cosmetic meter); reset token in URL query; 30-day session + 5-min cached role (delays revocation); custom-domain served without `domainVerified` (squatting on the unique index); float money math before `Decimal(10,2)`; purchase analytics uses client total, fire-and-forget; Resend errors swallowed (SDK returns `{error}`, doesn't throw); proxy DB lookup uncached per request; 5 raw `<img>` in dashboard editors; `robots.txt` Sitemap directive relative; editor section rows mouse-only; committed cruft (default create-next-app `README.md`, `MultiStore Landing Page.zip`, `themes-claude/*.zip`, `claude-design-export/support.js` inflating lint, dead `src/lib/db/mock-data.ts`); ESLint's 25 errors never gate the build; `getTestimonialsByShop` typed `Promise<Result<any[]>>` + `as any` in storefront render path.

---

## For your Claude Code — ordered action plan

Do these in order; the first block is ship-blocking.

**Sprint 0 — Security (do before anything else)**
1. **C1:** `input: false` on `role` in `src/lib/auth/index.ts`; add a `databaseHooks` guard; **scan the `User` table for rogue admins now.**
2. Build the `shopAction(schema, handler)` wrapper (resolve shop from session, `safeParse` input) and migrate `theme.ts` (H1), `order.updateOrderStatus` (H2), `variants.updateVariants` (H3), `coupons.getCouponsByShop` (H4) onto it. Grep every `"use server"` action that takes `shopId` as a param and convert it.
3. **H7:** add auth + shop-scoping to the three uploadthing middlewares.
4. **H5/H6/H8:** enforce zod (with the analytics-ID regexes) in every action; escape the JSON-LD; validate analytics IDs in `updateShop`.
5. **H9/H10:** fix `RSA-SHA256`; add BOG-payment-id idempotency + amount/currency check + additive expiry.
6. **H11:** add the security-headers block to `next.config.ts`.

**Sprint 1 — Correctness, SEO, perf**
7. Coupon TOCTOU + `updateCoupon` null-wipe + transactional stock restore.
8. **H12:** canonical URLs + fix `og:url`/sitemap to absolute subdomain URLs; absolute sitemap `<loc>`; filter inactive; fix robots disallow list; `lang="ka"`.
9. **H13:** slim storefront queries + `React.cache` + `*.ufs.sh` in `remotePatterns` + drop `unoptimized`; add `Order` indexes; cache storefront reads.
10. Make Resend lazy; remove `migrate deploy` from `build`; add env validation; `overrides` for the npm-audit vulns.

**Sprint 2 — Quality & a11y**
11. Add Vitest + a CI workflow (`tsc`, `eslint --max-warnings=0`, `npm audit --audit-level=high`, tests). Write tests for `createOrder` pricing/stock and each auth boundary first.
12. Accessibility pass: label association (`useId`), Radix Dialog for the cart, keyboard nav/`aria-expanded`, `KeyboardSensor`, `role="alert"`, contrast tokens, skip link.
13. Localize storefront/checkout strings to Georgian.
14. Fix the 25 ESLint errors (editor `static-components`/`set-state-in-effect` are real UX bugs); delete committed cruft; real README + `.env.example`.

---

*Notes on method: the automated verification pass in the multi-agent run misfired on some findings (it searched the wrong directory and wrongly marked several real security bugs as "file not found"). Every Critical/High security item above was therefore re-verified by hand against the clone — the file:line citations are real. Deep active exploitation on the production site was intentionally not performed (real merchants/payments); tenant-isolation was proven from source instead.*
