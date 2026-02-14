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

export async function approveReview(id: string, response?: string) {
  await requireAdmin();

  await prisma.review.update({
    where: { id },
    data: {
      approved: true,
      ...(response
        ? { adminResponse: response, adminResponseAt: new Date() }
        : {}),
    },
  });

  revalidatePath("/admin/reviews");
}

export async function rejectReview(id: string) {
  await requireAdmin();

  await prisma.review.delete({ where: { id } });

  revalidatePath("/admin/reviews");
}

export async function addResponse(id: string, text: string) {
  await requireAdmin();

  await prisma.review.update({
    where: { id },
    data: {
      adminResponse: text,
      adminResponseAt: new Date(),
    },
  });

  revalidatePath("/admin/reviews");
}
