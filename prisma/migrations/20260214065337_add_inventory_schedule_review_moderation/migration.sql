-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "adminResponse" TEXT,
ADD COLUMN     "adminResponseAt" TIMESTAMP(3),
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductStock" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variation" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleBlock" (
    "id" TEXT NOT NULL,
    "date" TEXT,
    "dayOfWeek" INTEGER,
    "time" TEXT,
    "reason" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductStock_productId_idx" ON "ProductStock"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStock_productId_variation_key" ON "ProductStock"("productId", "variation");

-- CreateIndex
CREATE INDEX "ScheduleBlock_date_idx" ON "ScheduleBlock"("date");

-- CreateIndex
CREATE INDEX "ScheduleBlock_dayOfWeek_idx" ON "ScheduleBlock"("dayOfWeek");
