---
name: schema-conventions
description: Money types, cascade rules, RESTRICT FKs, and shop isolation patterns in this schema
metadata:
  type: project
---

All monetary fields use `Decimal @db.Decimal(10, 2)` — no Float for money anywhere. Correct.

**RESTRICT foreign keys (intentional but must be handled in code):**
- `Order.shopId → Shop(id)` — RESTRICT (no onDelete). Shop cannot be deleted while orders exist. Confirmed in initial migration. Admin UI only has setShopActive, not delete, so this doesn't currently break anything.
- `OrderItem.variantId → Variant(id)` — RESTRICT. Calling `deleteVariant` on a variant with order history throws an unhandled FK violation. The `deleteVariant` action (src/lib/actions/variants.ts:154) has no try/catch for this case.
- `OrderItem.productId → Product(id)` — RESTRICT. No deleteProduct action exists currently, so this is latent.

**All other Shop-owned tables use onDelete: Cascade** (Product, Category, Coupon, Testimonial, ShopSection, OptionType, Subscriber, AnalyticsEvent).

**Unique constraints confirming per-shop scoping:**
- `Coupon: @@unique([shopId, code])` ✓
- `Category: @@unique([shopId, slug])` ✓
- `Product: @@unique([shopId, slug])` ✓
- `Shop.slug @unique` (global) ✓
- `Shop.customDomain @unique` (global) ✓

**Why:** These RESTRICT constraints were set from day one (initial migration 20260514). Order history must survive variant/product lifecycle changes.

**How to apply:** When writing any delete action for variants or products, always check for referencing OrderItems first and return a friendly error. Never rely on cascade for order data.
