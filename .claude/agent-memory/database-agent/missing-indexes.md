---
name: missing-indexes
description: Confirmed missing indexes and the query patterns that need them
metadata:
  type: project
---

**Missing as of 2026-07-07 audit:**

1. `Product (shopId, isActive, createdAt)` — needed for `getProductsByShop` and `searchProducts`: `WHERE shopId=? AND isActive=true ORDER BY createdAt DESC`. The existing `@@unique([shopId, slug])` covers shopId-only range scans but cannot cover the isActive filter or sort by createdAt. Every products-page load for a shop with many products pays a full sort.

2. `Account (userId)` or `Account (accountId, providerId)` — Better Auth queries accounts by userId (list linked accounts) and by (accountId, providerId) during OAuth login. Neither is indexed. Only the PK exists. Sequential scan for every OAuth login once Account table grows.

3. `Session (userId)` — Low priority since session lookups use the `token @unique` index. Only bulk operations (e.g., delete all sessions for a user) scan by userId. Cascade delete handles this in practice.

**Already covered:**
- `Order (shopId, createdAt)` — `@@index([shopId, createdAt])` ✓ (added migration 20260705)
- `Order (shopId, status)` — `@@index([shopId, status])` ✓
- `OrderItem (orderId)` — `@@index([orderId])` ✓
- `Coupon (shopId, code)` — `@@unique([shopId, code])` ✓
- `Shop.slug` — `@unique` ✓
- `Shop.customDomain` — `@unique` ✓
- `Session.token` — `@unique` ✓

**How to apply:** Before suggesting a new index, verify against this list. For Product queries that filter on shopId+isActive+orderBy createdAt, the suggested migration is: `@@index([shopId, isActive, createdAt])`.
