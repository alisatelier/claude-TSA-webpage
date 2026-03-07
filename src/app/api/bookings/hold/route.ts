import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { serviceId, selectedDate, selectedTime, userName, userEmail, userNotes, addOn, totalPrice, discountCode, discountAmount } =
    await request.json();

  if (!serviceId || !selectedDate || !selectedTime || !userName || !userEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate date against booking window settings
  const settings = await prisma.scheduleSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + settings.leadTimeDays);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + settings.maxRangeDays);

  const requested = new Date(selectedDate + "T00:00:00");
  if (requested < minDate || requested > maxDate) {
    return NextResponse.json(
      { error: `Date must be between ${settings.leadTimeDays} and ${settings.maxRangeDays} days from today` },
      { status: 400 },
    );
  }

  // Enforce max bookings per week
  // Week runs Monday–Sunday around the requested date
  const reqDay = requested.getDay(); // 0=Sun..6=Sat
  const mondayOffset = reqDay === 0 ? -6 : 1 - reqDay;
  const weekStart = new Date(requested);
  weekStart.setDate(weekStart.getDate() + mondayOffset);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);

  const now = new Date();

  const weekBookingCount = await prisma.serviceBooking.count({
    where: {
      selectedDate: { gte: weekStartStr, lte: weekEndStr },
      OR: [
        { status: "CONFIRMED" },
        { status: "COMPLETED" },
        { status: "HELD", expiresAt: { gt: now } },
      ],
    },
  });

  if (weekBookingCount >= settings.maxBookingsPerWeek) {
    return NextResponse.json(
      { error: "This week is fully booked" },
      { status: 409 },
    );
  }

  // Check one-hold-per-user: find any active hold for this user/session
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

  // Check slot availability (any service blocks the slot — single practitioner)
  const slotTaken = await prisma.serviceBooking.findFirst({
    where: {
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
      ...(userId ? { user: { connect: { id: userId } } } : {}),
      serviceId,
      selectedDate,
      selectedTime,
      status: "HELD",
      userName,
      userEmail,
      userNotes: userNotes || "",
      addOn: addOn ?? false,
      totalPrice,
      discountCode: discountCode ?? null,
      discountAmount: discountAmount ?? 0,
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
