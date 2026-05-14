/*
  Warnings:

  - Added the required column `priceFrom` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "priceFrom" DECIMAL(10,2) NOT NULL;
