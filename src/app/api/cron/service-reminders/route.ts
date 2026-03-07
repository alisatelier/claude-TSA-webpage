import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/cron-auth";
import { triggerServiceReminderEmail } from "@/lib/email/trigger";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Calculate tomorrow's date in MST (America/Edmonton)
  const now = new Date();
  const mstDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Edmonton" })
  );
  mstDate.setDate(mstDate.getDate() + 1);
  const tomorrow = mstDate.toISOString().split("T")[0]; // YYYY-MM-DD

  const bookings = await prisma.serviceBooking.findMany({
    where: {
      status: "CONFIRMED",
      selectedDate: tomorrow,
      reminderSent: false,
    },
  });

  for (const booking of bookings) {
    await triggerServiceReminderEmail(booking.id);
    await prisma.serviceBooking.update({
      where: { id: booking.id },
      data: { reminderSent: true },
    });
  }

  return NextResponse.json({
    success: true,
    reminders: bookings.length,
    date: tomorrow,
  });
}
