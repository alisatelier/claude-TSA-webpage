-- AlterTable: add orderNumber column (nullable first for backfill)
ALTER TABLE "Order" ADD COLUMN "orderNumber" INTEGER;

-- Backfill existing orders with sequential numbers starting at 11
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) + 10 AS rn
  FROM "Order"
)
UPDATE "Order" SET "orderNumber" = numbered.rn FROM numbered WHERE "Order".id = numbered.id;

-- Now make it NOT NULL
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
