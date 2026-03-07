import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret } from "@/lib/cron-auth";
import { triggerBirthdayMonthEmail } from "@/lib/email/trigger";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get current month and year in MST (America/Edmonton)
  const now = new Date();
  const mstDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Edmonton" })
  );
  const currentMonth = mstDate.getMonth() + 1; // 1-indexed
  const currentYear = mstDate.getFullYear();

  // Start of current month — used to exclude users who signed up this month
  const monthStart = new Date(currentYear, currentMonth - 1, 1);

  const loyaltyRecords = await prisma.loyalty.findMany({
    where: {
      birthdayMonth: currentMonth,
      NOT: { birthdayEmailSentYear: currentYear },
      // Skip users who signed up this month — they already see credits claimable in their account
      joinDate: { lt: monthStart },
    },
  });

  let sent = 0;
  for (const record of loyaltyRecords) {
    await triggerBirthdayMonthEmail(record.userId);
    await prisma.loyalty.update({
      where: { id: record.id },
      data: { birthdayEmailSentYear: currentYear },
    });
    sent++;
  }

  return NextResponse.json({
    success: true,
    emailsSent: sent,
    month: currentMonth,
    year: currentYear,
  });
}
