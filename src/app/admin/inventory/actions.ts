"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function adjustStock(
  productId: string,
  variation: string,
  amount: number,
  absolute?: boolean
) {
  await requireAdmin();

  const key = variation || "_default";

  if (absolute) {
    await prisma.productStock.upsert({
      where: { productId_variation: { productId, variation: key } },
      update: { stock: amount },
      create: { productId, variation: key, stock: amount },
    });
  } else {
    // Try update first; if it doesn't exist, create
    const existing = await prisma.productStock.findUnique({
      where: { productId_variation: { productId, variation: key } },
    });

    if (existing) {
      const newStock = Math.max(0, existing.stock + amount);
      await prisma.productStock.update({
        where: { productId_variation: { productId, variation: key } },
        data: { stock: newStock },
      });
    } else {
      await prisma.productStock.create({
        data: { productId, variation: key, stock: Math.max(0, amount) },
      });
    }
  }

  revalidatePath("/admin/inventory");
}
