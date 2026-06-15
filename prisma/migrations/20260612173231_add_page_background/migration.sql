-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "pageBackground" TEXT NOT NULL DEFAULT '#ffffff',
ALTER COLUMN "borderRadius" SET DEFAULT 'none',
ALTER COLUMN "fontFamily" SET DEFAULT 'sans',
ALTER COLUMN "secondaryColor" SET DEFAULT '#ffffff';
