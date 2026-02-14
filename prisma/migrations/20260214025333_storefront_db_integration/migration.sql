-- AlterTable
ALTER TABLE "Loyalty" ADD COLUMN     "lockedCurrency" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredCurrency" TEXT;

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cadPrice" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "variation" TEXT,
    "image" TEXT NOT NULL,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "holdId" TEXT,
    "selectedDate" TEXT,
    "selectedTime" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productId_variation_key" ON "CartItem"("cartId", "productId", "variation");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
