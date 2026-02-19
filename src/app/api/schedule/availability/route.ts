import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALL_SLOTS = ["12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  // Parse the day of week from the date string
  const dateObj = new Date(date + "T12:00:00");
  const dayOfWeek = dateObj.getDay(); // 0=Sun..6=Sat

  // Fetch all schedule blocks that could affect this date
  const blocks = await prisma.scheduleBlock.findMany({
    where: {
      OR: [
        // Recurring blocks for this day of week
        { isRecurring: true, dayOfWeek },
        // Date-specific blocks
        { isRecurring: false, date },
      ],
    },
  });

  // Determine which slots are blocked
  const blockedSlots = new Set<string>();
  let fullDayBlocked = false;

  for (const block of blocks) {
    if (block.time === null) {
      // Full day block
      fullDayBlocked = true;
      break;
    } else {
      blockedSlots.add(block.time);
    }
  }

  if (fullDayBlocked) {
    return NextResponse.json({ availableSlots: [], blockedSlots: ALL_SLOTS });
  }

  // Check weekly booking cap
  const settings = await prisma.scheduleSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  const reqDay = dateObj.getDay(); // 0=Sun..6=Sat
  const mondayOffset = reqDay === 0 ? -6 : 1 - reqDay;
  const weekStart = new Date(dateObj);
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
    return NextResponse.json({ availableSlots: [], blockedSlots: ALL_SLOTS, weekFull: true });
  }

  const availableSlots = ALL_SLOTS.filter((s) => !blockedSlots.has(s));

  return NextResponse.json({
    availableSlots,
    blockedSlots: ALL_SLOTS.filter((s) => blockedSlots.has(s)),
  });
}
