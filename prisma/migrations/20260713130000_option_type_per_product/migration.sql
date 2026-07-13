-- Step 1: Add productId and position as nullable initially
ALTER TABLE "OptionType" ADD COLUMN "productId" TEXT;
ALTER TABLE "OptionType" ADD COLUMN "position" INTEGER;

-- Step 2: Populate productId and position from ProductOptionType (first product per option type)
UPDATE "OptionType" ot
SET "productId" = (
    SELECT pot."productId" FROM "ProductOptionType" pot
    WHERE pot."optionTypeId" = ot.id
    ORDER BY pot."position" ASC NULLS LAST
    LIMIT 1
),
"position" = (
    SELECT COALESCE(pot."position", 0) FROM "ProductOptionType" pot
    WHERE pot."optionTypeId" = ot.id
    ORDER BY pot."position" ASC NULLS LAST
    LIMIT 1
);

-- Step 3: Drop the (shopId, name) unique constraint BEFORE creating copies
DROP INDEX IF EXISTS "OptionType_shopId_name_key";
ALTER TABLE "OptionType" DROP CONSTRAINT IF EXISTS "OptionType_shopId_fkey";

-- Step 4: For OptionTypes shared across multiple products, create copies for extra products
DO $$
DECLARE
    extra_rec RECORD;
    new_ot_id TEXT;
    ov_rec RECORD;
    new_ov_id TEXT;
BEGIN
    FOR extra_rec IN (
        SELECT pot."productId", pot."optionTypeId", COALESCE(pot."position", 0) AS pos
        FROM "ProductOptionType" pot
        JOIN "OptionType" ot ON ot.id = pot."optionTypeId"
        WHERE pot."productId" != ot."productId"
    ) LOOP
        new_ot_id := replace(gen_random_uuid()::text, '-', '');

        INSERT INTO "OptionType" (id, "shopId", "productId", name, position)
        SELECT new_ot_id, "shopId", extra_rec."productId", name, extra_rec.pos
        FROM "OptionType" WHERE id = extra_rec."optionTypeId";

        FOR ov_rec IN (
            SELECT * FROM "OptionValue" WHERE "optionTypeId" = extra_rec."optionTypeId"
        ) LOOP
            new_ov_id := replace(gen_random_uuid()::text, '-', '');

            INSERT INTO "OptionValue" (id, "optionTypeId", value)
            VALUES (new_ov_id, new_ot_id, ov_rec.value);

            UPDATE "VariantOptionValue" vov
            SET "optionValueId" = new_ov_id
            WHERE vov."optionValueId" = ov_rec.id
            AND EXISTS (
                SELECT 1 FROM "Variant" v
                WHERE v.id = vov."variantId"
                AND v."productId" = extra_rec."productId"
            );
        END LOOP;
    END LOOP;
END $$;

-- Step 5: Delete orphaned OptionTypes (not linked to any product)
DELETE FROM "OptionType" WHERE "productId" IS NULL;

-- Step 6: Set position = 0 for any remaining nulls
UPDATE "OptionType" SET "position" = 0 WHERE "position" IS NULL;

-- Step 7: Make both columns NOT NULL
ALTER TABLE "OptionType" ALTER COLUMN "productId" SET NOT NULL;
ALTER TABLE "OptionType" ALTER COLUMN "position" SET NOT NULL;
ALTER TABLE "OptionType" ALTER COLUMN "position" SET DEFAULT 0;

-- Step 8: Add FK constraint for productId
ALTER TABLE "OptionType" ADD CONSTRAINT "OptionType_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 9: Drop shopId column
ALTER TABLE "OptionType" DROP COLUMN "shopId";

-- Step 10: New unique constraint
CREATE UNIQUE INDEX "OptionType_productId_name_key" ON "OptionType"("productId", name);

-- Step 11: Drop ProductOptionType table
DROP TABLE "ProductOptionType";
