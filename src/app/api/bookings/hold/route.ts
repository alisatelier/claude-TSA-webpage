import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { serviceId, selectedDate, selectedTime, userName, userEmail, userNotes, addOn, totalPrice } =
    await request.json();

  if (!serviceId || !selectedDate || !selectedTime || !userName || !userEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check one-hold-per-user: find any active hold for this user/session
  const now = new Date();
  const activeHold = await prisma.serviceBooking.findFirst({
    where: {
      status: "HELD",
      expiresAt: { gt: now },
      ...(userId ? { userId } : { userEmail }),
    },
  });

  if (activeHold) {
    return NextResponse.json({ error: "You already have an active hold" }, { status: 409 });
  }

  // Check schedule blocks
  const dateObj = new Date(selectedDate + "T12:00:00");
  const dayOfWeek = dateObj.getDay();

  const scheduleBlock = await prisma.scheduleBlock.findFirst({
    where: {
      OR: [
        { isRecurring: true, dayOfWeek, time: null },
        { isRecurring: true, dayOfWeek, time: selectedTime },
        { isRecurring: false, date: selectedDate, time: null },
        { isRecurring: false, date: selectedDate, time: selectedTime },
      ],
    },
  });

  if (scheduleBlock) {
    return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
  }

  // Check slot availability
  const slotTaken = await prisma.serviceBooking.findFirst({
    where: {
      serviceId,
      selectedDate,
      selectedTime,
      OR: [
        { status: "CONFIRMED" },
        { status: "COMPLETED" },
        { status: "HELD", expiresAt: { gt: now } },
      ],
    },
  });

  if (slotTaken) {
    return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
  }

  const expiresAt = new Date(now.getTime() + HOLD_DURATION_MS);

  const booking = await prisma.serviceBooking.create({
    data: {
      userId,
      serviceId,
      selectedDate,
      selectedTime,
      status: "HELD",
      userName,
      userEmail,
      userNotes: userNotes || "",
      addOn: addOn ?? false,
      totalPrice,
      expiresAt,
    },
  });

  return NextResponse.json({
    holdId: booking.id,
    expiresAt: expiresAt.getTime(),
  });
}

export async function DELETE(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const url = new URL(request.url);
  const holdId = url.searchParams.get("holdId");

  if (!holdId) {
    return NextResponse.json({ error: "holdId is required" }, { status: 400 });
  }

  const booking = await prisma.serviceBooking.findUnique({ where: { id: holdId } });
  if (!booking || booking.status !== "HELD") {
    return NextResponse.json({ error: "Hold not found" }, { status: 404 });
  }

  // Verify ownership
  if (userId && booking.userId !== userId) {
    return NextResponse.json({ error: "Not your hold" }, { status: 403 });
  }

  await prisma.serviceBooking.update({
    where: { id: holdId },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ success: true });
}
