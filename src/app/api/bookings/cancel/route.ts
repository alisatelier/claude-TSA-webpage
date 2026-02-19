import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isWithin24Hours } from "@/lib/booking-utils";
import { deleteCalendarEvent } from "@/lib/google-calendar";
import {
  triggerBookingCancellationEmail,
  triggerAdminBookingCancellationEmail,
} from "@/lib/email/trigger";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await request.json();
  if (!bookingId) {
    return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
  }

  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed bookings can be cancelled" },
      { status: 400 },
    );
  }

  if (isWithin24Hours(booking.selectedDate, booking.selectedTime)) {
    return NextResponse.json(
      { error: "Cannot cancel within 24 hours of the session" },
      { status: 400 },
    );
  }

  await prisma.serviceBooking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  // Fire-and-forget: delete calendar event + send emails
  (async () => {
    if (booking.googleCalendarEventId) {
      await deleteCalendarEvent(booking.googleCalendarEventId);
    }
    triggerBookingCancellationEmail(bookingId);
    triggerAdminBookingCancellationEmail(bookingId);
  })();

  return NextResponse.json({ success: true });
}
