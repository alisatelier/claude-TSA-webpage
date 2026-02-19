import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.scheduleSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return NextResponse.json({
    leadTimeDays: settings.leadTimeDays,
    maxRangeDays: settings.maxRangeDays,
    maxBookingsPerWeek: settings.maxBookingsPerWeek,
  });
}
