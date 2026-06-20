-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "freeThreshold" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingRate" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "shippingType" TEXT NOT NULL DEFAULT 'free';
