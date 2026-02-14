-- Backfill NULL variations to empty string
UPDATE "Wishlist" SET "variation" = '' WHERE "variation" IS NULL;

-- Drop old unique constraint (userId, productId)
DROP INDEX IF EXISTS "Wishlist_userId_productId_key";

-- Make variation non-nullable with default
ALTER TABLE "Wishlist" ALTER COLUMN "variation" SET DEFAULT '';
ALTER TABLE "Wishlist" ALTER COLUMN "variation" SET NOT NULL;

-- Add new unique constraint (userId, productId, variation)
CREATE UNIQUE INDEX "Wishlist_userId_productId_variation_key" ON "Wishlist"("userId", "productId", "variation");
