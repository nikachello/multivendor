---
name: vendor-isolation-gaps
description: Queries with no shopId filter and how call sites compensate (or don't)
metadata:
  type: project
---

**Pattern used by write actions (correct):** fetch resource → get its shopId → assertOwnsShop(shopId) → write. All mutation paths in categories, products, coupons, variants, testimonials follow this.

**Read-path gaps — functions with no shopId parameter:**

1. `getProductWithOptions(id)` — src/lib/db/queries.ts:288. Call site (dashboard products/[id]/page.tsx) has NO post-fetch `product.shopId === shop.id` check. A seller knowing a competitor's product ID can view its full data (variants, prices, options) via the dashboard.

2. `getCategoryById(id)` — src/lib/db/queries.ts:244. Call site (dashboard categories/[id]/page.tsx) has NO post-fetch ownership check. The write action (updateCategory) is guarded, but the page renders the category data without verifying it belongs to the current shop.

3. `getOrderById(id)` — src/lib/db/queries.ts:620. BOTH call sites DO check `order.shopId !== shop.id` and call notFound(). So this is safe currently, but the function signature offers no DB-level protection.

4. `getProductById(id)` — src/lib/db/queries.ts:259. No call sites found in .tsx files currently; used only as a utility. Safe for now but has same structural gap.

**Why this matters:** Items 1 and 2 are live information-disclosure vulnerabilities. A logged-in seller can enumerate competitor product/category data by guessing IDs.

**How to apply:** When reviewing or adding read-path functions that take a bare `id`, always add a `shopId` parameter and add it to the WHERE clause, or add a post-fetch ownership assertion at the call site.
