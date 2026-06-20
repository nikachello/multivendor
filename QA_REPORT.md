# QA Report — Order Notes Feature + Storefront/Dashboard Changes
**Date:** 2026-06-20

---

## What Looks Good

- Prisma schema is valid (`npx prisma validate` passes cleanly). The `notes String?` field is correctly defined as nullable on the `Order` model.
- Migration SQL (`20260620090905_add_order_notes/migration.sql`) is minimal and correct: a single `ALTER TABLE "Order" ADD COLUMN "notes" TEXT;` with no default, matching the nullable schema.
- `orderSchema` in `src/lib/validations/order.ts` correctly adds `notes: z.string().optional()` and `OrderFormData` is re-derived via `z.infer`, so validation and the TypeScript type are always in sync.
- `CheckoutForm.tsx` wires the notes textarea correctly — value, onChange, and the EMPTY_FORM default all align with the `FormData` type.
- `CopyButton.tsx` is clean and correct: proper async clipboard API usage, 1.5-second feedback window, accessible `title` attribute, and good SVG icon swap.
- Dashboard `OrderDetailPage` correctly enforces multivendor isolation at line 39: `if (order.shopId !== shop.id) notFound()`.
- `updateOrderStatus` in `order.ts` correctly sends a status-update email only when `order.customerEmail` is present.
- `OrderStatusUpdate.tsx` email template is well-structured, handles all 6 order statuses, correctly extracts first name, and formats the order ID consistently with the rest of the codebase.
- `columns.tsx` stock calculation (tracked vs. unlimited) and status badge rendering are logically sound.
- Search, collection, and product pages all have correct `generateMetadata` + SEO tags including Open Graph and Twitter cards.

---

## UX/UI Issues

| # | File | Issue | Severity | Recommendation |
|---|------|-------|----------|----------------|
| 1 | `src/app/layout.tsx:8-28` | Two Google Fonts loaded (`Geist` and `Inter`) but `Inter` is applied to `<body>` while `geist.variable` only sets a CSS custom property. Geist is effectively unused, wasting a font download. | Medium | Pick one font. If Geist is the design intent, apply `geist.variable` to `<html>` and add `font-sans` to `<body>`. Remove the `Inter` import. |
| 2 | `src/components/storefront/checkout/CheckoutForm.tsx:221-229` | The notes textarea has no `maxlength` and the Zod schema has no `.max()` constraint. Users can submit arbitrarily large notes stored in the DB and rendered untruncated in the dashboard. | Medium | Add `notes: z.string().max(500).optional()` in `src/lib/validations/order.ts` and `maxLength={500}` on the textarea. |
| 3 | `src/components/storefront/checkout/CheckoutForm.tsx:315-337` | The `Field` component renders both `{hint}` and `{error}` side by side. When a field has an error, both "Optional" and the error message appear together — visually confusing. | Low | Conditionally render: show error when present, otherwise show hint. |
| 4 | `src/components/storefront/checkout/CheckoutForm.tsx` | No `id`/`htmlFor` linkage between `<label>` and `<input>`/`<select>`. Screen readers cannot associate labels with their controls. | Medium | Pass an `id` prop to `Field`, apply it to the input, and set `htmlFor={id}` on the label. |
| 5 | `src/app/(dashboard)/dashboard/(main)/orders/[id]/CopyButton.tsx` | Copy button has no `aria-label` announcing state change. Screen reader users get no feedback that copy succeeded. | Low | Add `aria-label={copied ? "Copied!" : "Copy order ID"}` to the button. |
| 6 | `src/app/(storefront)/shop/[slug]/order/[id]/page.tsx:90` | Order confirmation shows the raw full order ID (`#{order.id}`) instead of the last-8-character short form used everywhere else. | Low | Use `#{order.id.slice(-8).toUpperCase()}` for consistency. |

---

## Bugs Found

| # | File:Line | Description | Severity | Fix |
|---|-----------|-------------|----------|-----|
| 1 | `src/generated/prisma/` | **Prisma client not regenerated after schema change.** The `notes` field is missing from all generated types. Causes 3 TypeScript compile errors and `order.notes` will be `undefined` at runtime. **The app will not build.** | Critical | Run `npx prisma generate`. Add it to CI pipeline before `tsc`. |
| 2 | `src/app/(storefront)/shop/[slug]/order/[id]/page.tsx:46-49` | **Cross-shop order disclosure.** The page never checks `order.shopId === shop.id`. Any user who knows an order ID from another shop can view that order's full details (customer name, email, address, items, total). | Critical | Add `if (order.shopId !== shop.id) notFound();` after fetching the order — mirrors the same check already in the dashboard. |
| 3 | `src/lib/actions/order.ts:106,159` | **Fire-and-forget email sends.** Both `sendOrderConfirmation` and `sendOrderStatusUpdate` are called without `await`. Errors are silently lost, and `sendOrderConfirmation` is outside the try/catch so failures may crash the process. | High | Add `await` to both calls. Move `sendOrderConfirmation` inside the `try` block. Wrap `sendOrderStatusUpdate` in its own try/catch so email failure doesn't roll back a successful status update. |
| 4 | `src/app/(dashboard)/dashboard/(main)/products/columns.tsx:20` | **Decimal rendered as object.** `{row.original.priceFrom}` renders `[object Object]` because `priceFrom` is a Prisma `Decimal`, not a plain number. | High | Change to `{Number(row.original.priceFrom).toFixed(2)}`. |
| 5 | `src/lib/actions/order.ts:38` | **Missing null guard on `shopDetails`.** If `shopId` is invalid, the code proceeds silently and crashes at `prisma.order.create` with a foreign key violation. | Medium | Add `if (!shopDetails) return err({ code: ErrorCode.GENERAL_ERROR, message: "Shop not found", status: 404 });` after line 38. |
| 6 | `src/lib/actions/order.ts:97-104` | **Inventory decrement race condition.** Stock is decremented outside a transaction after the order is created. Two concurrent checkouts for the last item in stock can both succeed, driving inventory negative. | Medium | Wrap the order creation flow in `prisma.$transaction([...])`. Add a pre-check that `stock >= quantity` before decrementing. |
| 7 | `src/app/(storefront)/shop/[slug]/page.tsx:1` | **Incorrect `"use server"` directive on a page file.** This directive is only valid on Server Action files, not page components. | Low | Remove the `"use server";` line. |
| 8 | `src/lib/email.ts:7` | **Resend client instantiated with potentially undefined key.** If `RESEND_API_KEY` is not set, the client is initialized with `undefined` and gives a non-obvious auth error on first use. | Low | Add a guard: `if (!process.env.RESEND_API_KEY) console.warn("RESEND_API_KEY is not set — emails will not be sent");` |

---

## Missing Test Coverage

No test framework is configured in this project. Recommended additions:

- **`calcShipping()`** in `src/lib/actions/order.ts` — pure function, easy to unit test. Cover: free threshold crossing, zone match, zone miss, freeThreshold=0.
- **`orderSchema`** in `src/lib/validations/order.ts` — test missing required fields, invalid email, valid/invalid notes length.
- **`CopyButton`** component — initial state, click → clipboard write, feedback timeout, clipboard API failure.
- **`updateOrderStatus`** — test vendor ownership check (currently missing entirely).

---

## Regressions / Integration Risks

1. **Build is currently broken.** `npx tsc --noEmit` exits with 3 errors due to stale Prisma client. Must run `npx prisma generate` before any deployment.

2. **`updateOrderStatus` has no authorization check.** The server action accepts `(orderId, status)` with no verification the caller owns that order's shop. Any authenticated seller can change another seller's order status. Fix: add `shopId` parameter and verify `order.shopId === shopId` inside the action.

3. **Email sender `orders@resend.dev` is a Resend sandbox address.** Must be updated to a verified domain before production.

4. **`shopDetails?.name ?? "Store"` fallback** will send confirmation emails with wrong shop name if `shopDetails` is null (already a bug — see Bug #5).

---

## Summary

**Total issues: 14 (Critical: 2, High: 2, Medium: 4, Low: 6)**

### Priority Actions

1. `npx prisma generate` — build is broken, nothing ships without this
2. Add `if (order.shopId !== shop.id) notFound();` to the storefront order page — one-line security fix for a data leak
3. Add `await` to both email send calls in `order.ts` and move `sendOrderConfirmation` inside try block
4. Fix `priceFrom` Decimal rendering in `columns.tsx` — currently shows `[object Object]`
5. Add authorization check to `updateOrderStatus` server action