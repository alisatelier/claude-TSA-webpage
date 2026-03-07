"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { triggerWishlistBackInStockEmail } from "@/lib/email/trigger";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function notifyBackInStock(productId: string, variation: string) {
  const wishlistItems = await prisma.wishlist.findMany({
    where: {
      productId,
      variation: variation === "_default" ? "" : variation,
      notifiedAt: null,
    },
  });

  for (const item of wishlistItems) {
    await triggerWishlistBackInStockEmail(
      item.userId,
      item.productId,
      item.variation || undefined
    );
    await prisma.wishlist.update({
      where: { id: item.id },
      data: { notifiedAt: new Date() },
    });
  }
}

export async function adjustStock(
  productId: string,
  variation: string,
  amount: number,
  absolute?: boolean
) {
  await requireAdmin();

  const key = variation || "_default";

  let oldStock = 0;
  let newStock = 0;

  if (absolute) {
    const existing = await prisma.productStock.findUnique({
      where: { productId_variation: { productId, variation: key } },
    });
    oldStock = existing?.stock ?? 0;
    newStock = amount;

    await prisma.productStock.upsert({
      where: { productId_variation: { productId, variation: key } },
      update: { stock: amount },
      create: { productId, variation: key, stock: amount },
    });
  } else {
    const existing = await prisma.productStock.findUnique({
      where: { productId_variation: { productId, variation: key } },
    });
    oldStock = existing?.stock ?? 0;
    newStock = Math.max(0, oldStock + amount);

    if (existing) {
      await prisma.productStock.update({
        where: { productId_variation: { productId, variation: key } },
        data: { stock: newStock },
      });
    } else {
      await prisma.productStock.create({
        data: { productId, variation: key, stock: newStock },
      });
    }
  }

  // Trigger back-in-stock notifications when stock goes from 0 to >0
  if (oldStock === 0 && newStock > 0) {
    await notifyBackInStock(productId, key);
  }

  revalidatePath("/admin/inventory");
}
