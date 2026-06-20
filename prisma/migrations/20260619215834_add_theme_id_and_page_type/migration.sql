-- DropIndex
DROP INDEX "ShopSection_shopId_order_idx";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "themeId" TEXT NOT NULL DEFAULT 'minimal';

-- AlterTable
ALTER TABLE "ShopSection" ADD COLUMN     "pageType" TEXT NOT NULL DEFAULT 'home';

-- CreateIndex
CREATE INDEX "ShopSection_shopId_pageType_order_idx" ON "ShopSection"("shopId", "pageType", "order");
