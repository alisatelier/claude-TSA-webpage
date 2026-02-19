import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWithin24Hours } from "@/lib/booking-utils";
import { deleteCalendarEvent, createCalendarEvent } from "@/lib/google-calendar";
import {
  triggerBookingRescheduleEmail,
  triggerAdminBookingRescheduleEmail,
} from "@/lib/email/trigger";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, newDate, newTime } = await request.json();
  if (!bookingId || !newDate || !newTime) {
    return NextResponse.json(
      { error: "bookingId, newDate, and newTime are required" },
      { status: 400 },
    );
  }

  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed bookings can be rescheduled" },
      { status: 400 },
    );
  }

  if (isWithin24Hours(booking.selectedDate, booking.selectedTime)) {
    return NextResponse.json(
      { error: "Cannot reschedule within 24 hours of the session" },
      { status: 400 },
    );
  }

  // Reject if new slot is the same as current
  if (newDate === booking.selectedDate && newTime === booking.selectedTime) {
    return NextResponse.json(
      { error: "New date/time is the same as the current booking" },
      { status: 400 },
    );
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

  const requestedDate = new Date(newDate + "T00:00:00");
  if (requestedDate < minDate || requestedDate > maxDate) {
    return NextResponse.json(
      { error: `Date must be between ${settings.leadTimeDays} and ${settings.maxRangeDays} days from today` },
      { status: 400 },
    );
  }

  // Check schedule blocks for new slot
  const dateObj = new Date(newDate + "T12:00:00");
  const dayOfWeek = dateObj.getDay();

  const scheduleBlock = await prisma.scheduleBlock.findFirst({
    where: {
      OR: [
        { isRecurring: true, dayOfWeek, time: null },
        { isRecurring: true, dayOfWeek, time: newTime },
        { isRecurring: false, date: newDate, time: null },
        { isRecurring: false, date: newDate, time: newTime },
      ],
    },
  });

  if (scheduleBlock) {
    return NextResponse.json(
      { error: "Selected time slot is not available" },
      { status: 409 },
    );
  }

  const oldDate = booking.selectedDate;
  const oldTime = booking.selectedTime;
  const oldCalendarEventId = booking.googleCalendarEventId;

  // Transaction: re-check availability and update
  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    const conflict = await tx.serviceBooking.findFirst({
      where: {
        serviceId: booking.serviceId,
        selectedDate: newDate,
        selectedTime: newTime,
        id: { not: bookingId },
        OR: [
          { status: "CONFIRMED" },
          { status: "COMPLETED" },
          { status: "HELD", expiresAt: { gt: now } },
        ],
      },
    });

    if (conflict) return null;

    return tx.serviceBooking.update({
      where: { id: bookingId },
      data: {
        selectedDate: newDate,
        selectedTime: newTime,
        googleCalendarEventId: null,
        googleMeetLink: null,
      },
    });
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Selected time slot is no longer available" },
      { status: 409 },
    );
  }

  // Fire-and-forget: delete old event → create new event → send emails
  (async () => {
    if (oldCalendarEventId) {
      await deleteCalendarEvent(oldCalendarEventId);
    }
    await createCalendarEvent(bookingId);
    triggerBookingRescheduleEmail(bookingId, oldDate, oldTime);
    triggerAdminBookingRescheduleEmail(bookingId, oldDate, oldTime);
  })();

  return NextResponse.json({
    success: true,
    selectedDate: updated.selectedDate,
    selectedTime: updated.selectedTime,
  });
}
