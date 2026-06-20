/*
  Warnings:

  - You are about to drop the column `shippingType` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "shippingType",
ADD COLUMN     "shippingZones" JSONB NOT NULL DEFAULT '[]';
