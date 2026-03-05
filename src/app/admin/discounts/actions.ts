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

export async function createDiscountCode(
  code: string,
  type: "PERCENTAGE" | "FIXED",
  value: number,
  maxUses: number | null,
  expiresAt: string | null,
  maxUsesPerCustomer: number | null = null,
) {
  await requireAdmin();

  const normalized = code.trim().toUpperCase();
  if (!normalized || value <= 0) {
    throw new Error("Invalid discount code parameters");
  }
  if (type === "PERCENTAGE" && value > 100) {
    throw new Error("Percentage cannot exceed 100");
  }

  await prisma.discountCode.create({
    data: {
      code: normalized,
      type,
      value,
      maxUses,
      maxUsesPerCustomer,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  revalidatePath("/admin/discounts");
}

export async function updateDiscountCode(
  id: string,
  data: {
    code?: string;
    type?: "PERCENTAGE" | "FIXED";
    value?: number;
    maxUses?: number | null;
    maxUsesPerCustomer?: number | null;
    expiresAt?: string | null;
  },
) {
  await requireAdmin();

  const updateData: Record<string, unknown> = {};
  if (data.code !== undefined) updateData.code = data.code.trim().toUpperCase();
  if (data.type !== undefined) updateData.type = data.type;
  if (data.value !== undefined) updateData.value = data.value;
  if (data.maxUses !== undefined) updateData.maxUses = data.maxUses;
  if (data.maxUsesPerCustomer !== undefined) updateData.maxUsesPerCustomer = data.maxUsesPerCustomer;
  if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

  await prisma.discountCode.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/discounts");
}

export async function toggleDiscountCode(id: string) {
  await requireAdmin();

  const existing = await prisma.discountCode.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");

  await prisma.discountCode.update({
    where: { id },
    data: { active: !existing.active },
  });

  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();

  await prisma.discountCode.delete({ where: { id } });

  revalidatePath("/admin/discounts");
}
