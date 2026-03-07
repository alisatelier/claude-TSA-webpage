import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/cron-auth";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.serviceBooking.deleteMany({
    where: {
      status: "HELD",
      expiresAt: { lt: new Date() },
    },
  });

  return NextResponse.json({
    success: true,
    cleaned: result.count,
  });
}
