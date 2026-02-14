import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serviceId = url.searchParams.get("serviceId");
  const date = url.searchParams.get("date");
  const time = url.searchParams.get("time");

  if (!serviceId || !date || !time) {
    return NextResponse.json({ error: "serviceId, date, and time are required" }, { status: 400 });
  }

  const now = new Date();

  // Check schedule blocks first
  const dateObj = new Date(date + "T12:00:00");
  const dayOfWeek = dateObj.getDay();

  const scheduleBlock = await prisma.scheduleBlock.findFirst({
    where: {
      OR: [
        // Full day recurring block
        { isRecurring: true, dayOfWeek, time: null },
        // Specific slot recurring block
        { isRecurring: true, dayOfWeek, time },
        // Full day date-specific block
        { isRecurring: false, date, time: null },
        // Specific slot date-specific block
        { isRecurring: false, date, time },
      ],
    },
  });

  if (scheduleBlock) {
    return NextResponse.json({ taken: true });
  }

  const existing = await prisma.serviceBooking.findFirst({
    where: {
      serviceId,
      selectedDate: date,
      selectedTime: time,
      OR: [
        { status: "CONFIRMED" },
        { status: "COMPLETED" },
        { status: "HELD", expiresAt: { gt: now } },
      ],
    },
  });

  return NextResponse.json({ taken: !!existing });
}
