ALTER TABLE "ShowcaseItem"
  ADD COLUMN IF NOT EXISTS "generationPriceCredits" INTEGER;

ALTER TABLE "OrderAsset"
  ADD COLUMN IF NOT EXISTS "personIndex" INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'OrderAsset_orderId_type_personIndex_idx'
  ) THEN
    CREATE INDEX "OrderAsset_orderId_type_personIndex_idx"
      ON "OrderAsset"("orderId", "type", "personIndex");
  END IF;
END
$$;
