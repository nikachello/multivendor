-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true;
