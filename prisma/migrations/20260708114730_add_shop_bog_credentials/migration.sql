-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "bogClientId" TEXT,
ADD COLUMN     "bogClientSecret" TEXT;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_accountId_providerId_idx" ON "Account"("accountId", "providerId");

-- CreateIndex
CREATE INDEX "Product_shopId_isActive_createdAt_idx" ON "Product"("shopId", "isActive", "createdAt" DESC);
