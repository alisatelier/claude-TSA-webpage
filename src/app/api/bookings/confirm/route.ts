import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { holdId } = await request.json();

  if (!holdId) {
    return NextResponse.json({ error: "holdId is required" }, { status: 400 });
  }

  const booking = await prisma.serviceBooking.findUnique({ where: { id: holdId } });
  if (!booking || booking.status !== "HELD") {
    return NextResponse.json({ error: "Hold not found or already processed" }, { status: 404 });
  }

  // Check expiry
  if (booking.expiresAt && booking.expiresAt <= new Date()) {
    await prisma.serviceBooking.update({
      where: { id: holdId },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json({ error: "Hold has expired" }, { status: 410 });
  }

  // Verify ownership
  if (userId && booking.userId && booking.userId !== userId) {
    return NextResponse.json({ error: "Not your hold" }, { status: 403 });
  }

  const confirmed = await prisma.serviceBooking.update({
    where: { id: holdId },
    data: {
      status: "CONFIRMED",
      expiresAt: null,
    },
  });

  return NextResponse.json({
    bookingId: confirmed.id,
    status: "confirmed",
    serviceId: confirmed.serviceId,
    selectedDate: confirmed.selectedDate,
    selectedTime: confirmed.selectedTime,
    createdAt: confirmed.createdAt.toISOString(),
  });
}
