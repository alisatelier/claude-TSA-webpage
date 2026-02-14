import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerBirthdayMonthEmail } from "@/lib/email/trigger";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { month, claim } = await request.json();

  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  // Set birthday month
  if (month !== undefined) {
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid month" }, { status: 400 });
    }
    await prisma.loyalty.update({
      where: { userId },
      data: { birthdayMonth: month },
    });
    return NextResponse.json({ success: true });
  }

  // Claim birthday credits
  if (claim) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (loyalty.birthdayMonth !== currentMonth) {
      return NextResponse.json({ error: "Not your birthday month" }, { status: 400 });
    }
    if (loyalty.birthdayClaimed === currentYear) {
      return NextResponse.json({ error: "Already claimed this year" }, { status: 400 });
    }

    const bdayCredits = 150;
    const newBalance = loyalty.currentCredits + bdayCredits;
    const newLifetime = loyalty.lifetimeCredits + bdayCredits;

    await prisma.loyalty.update({
      where: { userId },
      data: {
        currentCredits: newBalance,
        lifetimeCredits: newLifetime,
        birthdayClaimed: currentYear,
      },
    });

    await prisma.transactionLog.create({
      data: {
        userId,
        action: "Birthday credits",
        credits: bdayCredits,
        runningBalance: newBalance,
      },
    });

    // Fire-and-forget birthday email
    triggerBirthdayMonthEmail(userId);

    return NextResponse.json({ success: true, creditsAwarded: bdayCredits });
  }

  return NextResponse.json({ error: "Provide month or claim" }, { status: 400 });
}
