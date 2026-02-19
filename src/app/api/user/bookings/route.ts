import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ bookings: [] });
  }

  const bookings = await prisma.serviceBooking.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["CONFIRMED", "HELD", "COMPLETED", "CANCELLED"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      serviceId: true,
      selectedDate: true,
      selectedTime: true,
      status: true,
      userName: true,
      userEmail: true,
      userNotes: true,
      addOn: true,
      totalPrice: true,
      expiresAt: true,
      googleMeetLink: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ bookings });
}
