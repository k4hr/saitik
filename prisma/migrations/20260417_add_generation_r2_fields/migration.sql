-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'GenerationMode'
  ) THEN
    CREATE TYPE "GenerationMode" AS ENUM ('READY', 'REFERENCE', 'EDIT');
  END IF;
END
$$;

-- Extend enum CreditTransactionType with WELCOME_BONUS
ALTER TYPE "CreditTransactionType" ADD VALUE IF NOT EXISTS 'WELCOME_BONUS';

-- User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "welcomeOfferEndsAt" TIMESTAMP(3);

-- StylePreset
ALTER TABLE "StylePreset"
  ADD COLUMN IF NOT EXISTS "promptTemplate" TEXT,
  ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT;

-- Order
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "mode" "GenerationMode" NOT NULL DEFAULT 'READY',
  ADD COLUMN IF NOT EXISTS "selectedFormat" TEXT,
  ADD COLUMN IF NOT EXISTS "selectedMood" TEXT,
  ADD COLUMN IF NOT EXISTS "notes" TEXT,
  ADD COLUMN IF NOT EXISTS "promptInput" TEXT,
  ADD COLUMN IF NOT EXISTS "promptFinal" TEXT,
  ADD COLUMN IF NOT EXISTS "errorMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "shareId" TEXT,
  ADD COLUMN IF NOT EXISTS "creditsSpent" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "priceRub" INTEGER,
  ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'RUB',
  ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "finishedAt" TIMESTAMP(3);

-- Fill shareId for existing rows if empty
UPDATE "Order"
SET "shareId" = md5(random()::text || clock_timestamp()::text || "id")
WHERE "shareId" IS NULL OR "shareId" = '';

-- Make shareId required
ALTER TABLE "Order"
  ALTER COLUMN "shareId" SET NOT NULL;

-- Unique index for shareId
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'Order_shareId_key'
  ) THEN
    CREATE UNIQUE INDEX "Order_shareId_key" ON "Order"("shareId");
  END IF;
END
$$;

-- OrderAsset
ALTER TABLE "OrderAsset"
  ADD COLUMN IF NOT EXISTS "storageKey" TEXT,
  ADD COLUMN IF NOT EXISTS "publicUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "fileName" TEXT,
  ADD COLUMN IF NOT EXISTS "fileSize" INTEGER,
  ADD COLUMN IF NOT EXISTS "mimeType" TEXT,
  ADD COLUMN IF NOT EXISTS "width" INTEGER,
  ADD COLUMN IF NOT EXISTS "height" INTEGER,
  ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Payment
ALTER TABLE "Payment"
  ADD COLUMN IF NOT EXISTS "creditsPurchased" INTEGER;

-- Indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'ShowcaseItem_kind_isActive_sortOrder_idx'
  ) THEN
    CREATE INDEX "ShowcaseItem_kind_isActive_sortOrder_idx"
      ON "ShowcaseItem"("kind", "isActive", "sortOrder");
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'ShowcaseItem_categoryId_isActive_sortOrder_idx'
  ) THEN
    CREATE INDEX "ShowcaseItem_categoryId_isActive_sortOrder_idx"
      ON "ShowcaseItem"("categoryId", "isActive", "sortOrder");
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'ShowcaseItem_subcategoryId_isActive_sortOrder_idx'
  ) THEN
    CREATE INDEX "ShowcaseItem_subcategoryId_isActive_sortOrder_idx"
      ON "ShowcaseItem"("subcategoryId", "isActive", "sortOrder");
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'ShowcaseItem_stylePresetId_idx'
  ) THEN
    CREATE INDEX "ShowcaseItem_stylePresetId_idx"
      ON "ShowcaseItem"("stylePresetId");
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'OrderAsset_orderId_type_sortOrder_idx'
  ) THEN
    CREATE INDEX "OrderAsset_orderId_type_sortOrder_idx"
      ON "OrderAsset"("orderId", "type", "sortOrder");
  END IF;
END
$$;
