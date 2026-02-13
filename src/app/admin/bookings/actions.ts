"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  await requireAdmin();
  await prisma.serviceBooking.update({
    where: { id: bookingId },
    data: { status },
  });
  revalidatePath("/admin/bookings");
}
