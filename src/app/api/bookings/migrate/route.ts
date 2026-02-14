import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface BookingMigrationData {
  bookings: Array<{
    serviceId: string;
    selectedDate: string;
    selectedTime: string;
    userName: string;
    userEmail: string;
    userNotes?: string;
    addOn: boolean;
    totalPrice: number;
    createdAt: string;
  }>;
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const data: BookingMigrationData = await request.json();

  if (!data.bookings?.length) {
    return NextResponse.json({ success: true });
  }

  for (const booking of data.bookings) {
    // Check if already exists (same slot)
    const existing = await prisma.serviceBooking.findFirst({
      where: {
        serviceId: booking.serviceId,
        selectedDate: booking.selectedDate,
        selectedTime: booking.selectedTime,
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    });

    if (!existing) {
      await prisma.serviceBooking.create({
        data: {
          userId,
          serviceId: booking.serviceId,
          selectedDate: booking.selectedDate,
          selectedTime: booking.selectedTime,
          status: "CONFIRMED",
          userName: booking.userName,
          userEmail: booking.userEmail,
          userNotes: booking.userNotes || "",
          addOn: booking.addOn,
          totalPrice: booking.totalPrice,
          createdAt: new Date(booking.createdAt),
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
