---
name: performance-patterns
description: Known slow query patterns and the generateVariants N-write loop
metadata:
  type: project
---

**1. getCollectionData — full category load, in-memory filter (src/lib/db/queries.ts:467)**
Fetches ALL active products in a category with the full `productInclude` (images, categories, variants → optionValues → optionType). Filtering (price, stock, option facets), sorting, and pagination all happen in JS. For large categories (100+ products with many variants), this loads a large object graph into Node memory before returning paginated results. The `facets` object is built from the full result set.
Fix path: move filtering and pagination to the DB query; build facets from a separate aggregation query.

**2. generateVariants loop (src/lib/actions/variants.ts:74-98)**
Creates each variant combination in a sequential `for` loop with individual `prisma.variant.create()` calls. Not wrapped in a transaction. For M×N option combinations, this is M×N DB round trips. A failure mid-loop leaves partial variants created.
Fix: wrap the loop in `prisma.$transaction()`. Or restructure to use `createMany` for the variant rows and a separate createMany for the VariantOptionValue join rows.

**3. Multi-round-trip write pattern (all action files)**
Every mutation that starts from a resource ID does: (1) fetch resource to get shopId, (2) assertOwnsShop → fetch shop, (3) write. This is 2–3 DB round trips before the actual write. Acceptable for now, but be aware when adding new action types.

**4. addProductImages Promise.all (src/lib/actions/products.ts:35)**
N parallel `prisma.productImage.create()` calls outside a transaction. Partial failures leave orphaned images. Should use `createMany` or a transaction.
