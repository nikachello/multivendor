---
name: qa-patterns
description: Recurring bug patterns, test conventions, and architectural quirks found during QA
metadata:
  type: project
---

## Recurring Bug Patterns

**1. Prisma generate not run after schema changes**
After every `prisma/schema.prisma` edit, `npx prisma generate` must be run to regenerate `src/generated/prisma/`. Failing to do so causes TS errors like "Property X does not exist on type" across all files that use the affected model. First thing to check when TS errors reference Prisma model fields.

**2. Storefront order pages missing shopId cross-check**
Pages at `/shop/[slug]/order/[id]/page.tsx` fetch both shop (by slug) and order (by id) but do NOT verify `order.shopId === shop.id`. An attacker can visit `/shop/shop-a/order/<id-from-shop-b>` and see another shop's order. Pattern: always add this check after both are resolved.

**3. Fire-and-forget email sends in server actions**
Both `sendOrderConfirmation` and `sendOrderStatusUpdate` are called without `await` in `src/lib/actions/order.ts`. If the email function throws, the error is silently swallowed. Should be awaited (or wrapped in try/catch and logged).

**4. Prisma findFirst without null check before order creation**
`createOrder` calls `prisma.shop.findFirst({ where: { id: shopId } })` but does not guard against `null`. If a bogus shopId is passed the create will fail with a foreign key violation caught by the generic catch block — acceptable but error message is misleading ("Failed to place order" instead of "Shop not found").

**5. Decimal fields rendered without toFixed()**
`columns.tsx` renders `priceFrom` directly as `{row.original.priceFrom}` — this is a Prisma `Decimal` object, which serializes as `[object Object]` when coerced to string in JSX. Needs `Number(row.original.priceFrom).toFixed(2)`.

**6. Font class conflict in root layout**
`layout.tsx` applies `inter.className` to `<body>` and `geist.variable` to `<html>`. The `geist.variable` sets `--font-sans` but `inter.className` hardcodes Inter on body. The actual body text uses Inter not Geist, making the CSS variable ineffective for body text.

**7. `"use server"` on a page component**
`src/app/(storefront)/shop/[slug]/page.tsx` declares `"use server"` at line 1. Next.js App Router page files are Server Components by default — this directive is meaningless on a page but could cause confusion or future issues if the file exports non-action items.

## Test Conventions
- No test files found yet for this project (as of 2026-06-20 review). Coverage is zero.
- Testing framework: not yet configured (no jest/vitest config found).

**Why:** To guide future QA passes and know where to look first.
**How to apply:** On any PR touching Prisma schema, always run `npx prisma generate` first. On any storefront route that loads an order/resource by ID, verify the resource's shopId matches the shop from the URL.
