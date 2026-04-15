-- CreateEnum
CREATE TYPE "ShowcaseKind" AS ENUM ('READY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "ShowcaseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowcaseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowcaseSubcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowcaseSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowcaseItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "ShowcaseKind" NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "stylePresetId" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowcaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowcaseCategory_slug_key" ON "ShowcaseCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ShowcaseSubcategory_categoryId_slug_key" ON "ShowcaseSubcategory"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "ShowcaseSubcategory_categoryId_sortOrder_idx" ON "ShowcaseSubcategory"("categoryId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ShowcaseItem_slug_key" ON "ShowcaseItem"("slug");

-- CreateIndex
CREATE INDEX "ShowcaseItem_kind_isActive_sortOrder_idx" ON "ShowcaseItem"("kind", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ShowcaseItem_categoryId_isActive_sortOrder_idx" ON "ShowcaseItem"("categoryId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ShowcaseItem_subcategoryId_isActive_sortOrder_idx" ON "ShowcaseItem"("subcategoryId", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ShowcaseItem_stylePresetId_idx" ON "ShowcaseItem"("stylePresetId");

-- AddForeignKey
ALTER TABLE "ShowcaseSubcategory"
ADD CONSTRAINT "ShowcaseSubcategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "ShowcaseCategory"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseItem"
ADD CONSTRAINT "ShowcaseItem_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "ShowcaseCategory"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseItem"
ADD CONSTRAINT "ShowcaseItem_subcategoryId_fkey"
FOREIGN KEY ("subcategoryId") REFERENCES "ShowcaseSubcategory"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseItem"
ADD CONSTRAINT "ShowcaseItem_stylePresetId_fkey"
FOREIGN KEY ("stylePresetId") REFERENCES "StylePreset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseItem"
ADD CONSTRAINT "ShowcaseItem_createdByUserId_fkey"
FOREIGN KEY ("createdByUserId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
