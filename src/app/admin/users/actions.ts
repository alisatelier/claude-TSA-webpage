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
    // Ensure loyalty record exists (create if missing)
    let loyalty = await tx.loyalty.findUnique({ where: { userId } });
    if (!loyalty) {
      loyalty = await tx.loyalty.create({
        data: {
          userId,
          referralCode: `REF-${userId.slice(-8).toUpperCase()}`,
        },
      });
    }

    if (loyalty.currentCredits + amount < 0) {
      throw new Error(
        `Cannot deduct ${Math.abs(amount)} credits — user only has ${loyalty.currentCredits}`
      );
    }

    // Update loyalty credits (what the customer actually sees/uses)
    const newBalance = loyalty.currentCredits + amount;
    await tx.loyalty.update({
      where: { userId },
      data: {
        currentCredits: newBalance,
        // Only increase lifetime for positive adjustments
        ...(amount > 0 ? { lifetimeCredits: { increment: amount } } : {}),
      },
    });

    // Keep User.ritualCredits in sync
    await tx.user.update({
      where: { id: userId },
      data: { ritualCredits: newBalance },
    });

    // Log to TransactionLog (visible to customer)
    await tx.transactionLog.create({
      data: {
        userId,
        action: `Admin: ${reason}`,
        credits: amount,
        runningBalance: newBalance,
      },
    });

    // Log to RitualCreditLog (admin audit trail)
    await tx.ritualCreditLog.create({
      data: {
        userId,
        adminId: session.user.id,
        amount,
        reason,
      },
    });
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  redirect("/admin/users");
}
