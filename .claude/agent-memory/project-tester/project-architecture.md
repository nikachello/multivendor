---
name: project-architecture
description: Core stack and architecture of the multivendor Next.js e-commerce project
metadata:
  type: project
---

Multivendor storefront + dashboard app.

**Stack:** Next.js App Router, Prisma ORM (custom generator, output at `src/generated/prisma/`), PostgreSQL, Tailwind CSS, TypeScript, BetterAuth (session via `auth.api.getSession`), Resend (email), React Email.

**Key conventions:**
- Prisma client generated to `src/generated/prisma/` — NOT the default `node_modules/.prisma/client`. After any schema change, `npx prisma generate` must be run before `tsc` will pass.
- Result pattern: all DB queries and server actions return `ok(data)` or `err({code, message, status})` from `src/lib/result.ts`.
- Auth helper: `src/lib/auth/get-shop.ts` — calls `auth.api.getSession` and redirects if unauthenticated. Used on all dashboard routes.
- Multivendor isolation: dashboard pages call `getShop()` which returns the shop owned by the current user, then cross-check `order.shopId === shop.id` before rendering.
- Storefront pages: no auth required — but order detail pages at `/shop/[slug]/order/[id]/` must verify `order.shopId === shop.id` (this check was missing as of 2026-06-20).

**Why:** To understand auth boundaries and where to look for missing vendor isolation checks.
**How to apply:** Always verify storefront order/data pages cross-check the record's shopId against the shop resolved from the URL slug.
