-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "Testimonial_shopId_productId_idx" ON "Testimonial"("shopId", "productId");
