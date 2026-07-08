/*
  Warnings:

  - You are about to drop the column `bogClientId` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `bogClientSecret` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "bogClientId",
DROP COLUMN "bogClientSecret",
ADD COLUMN     "paymentConfig" JSONB NOT NULL DEFAULT '{}';
