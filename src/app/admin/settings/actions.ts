"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.passwordHash) {
    return { error: "User not found" };
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  return { success: true };
}
