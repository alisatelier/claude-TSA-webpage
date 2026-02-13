"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function adjustCredits(
  userId: string,
  amount: number,
  reason: string
) {
  const session = await requireAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { ritualCredits: { increment: amount } },
    });
    await tx.ritualCreditLog.create({
      data: {
        userId,
        adminId: session.user.id,
        amount,
        reason,
      },
    });
  });

  revalidatePath(`/admin/users/${userId}`);
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  redirect("/admin/users");
}
