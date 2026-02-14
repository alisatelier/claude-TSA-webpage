import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [loyalty, transactions, reviews, orderItems, user] = await Promise.all([
    prisma.loyalty.findUnique({ where: { userId } }),
    prisma.transactionLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: { userId },
      select: { productId: true },
    }),
    prisma.orderItem.findMany({
      where: { order: { userId } },
      select: { productId: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { preferredCurrency: true },
    }),
  ]);

  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  const purchasedProducts = [...new Set(orderItems.map((oi) => oi.productId))];
  const reviewedProducts = reviews.map((r) => r.productId);

  // Resolve referrer name from referral code
  let referredByName: string | null = null;
  if (loyalty.referredBy) {
    const referrerLoyalty = await prisma.loyalty.findUnique({
      where: { referralCode: loyalty.referredBy },
      include: { user: { select: { name: true } } },
    });
    referredByName = referrerLoyalty?.user.name ?? null;
  }

  return NextResponse.json({
    currentCredits: loyalty.currentCredits,
    lifetimeCredits: loyalty.lifetimeCredits,
    pointsHistory: transactions.map((t) => ({
      date: t.createdAt.toISOString(),
      action: t.action,
      credits: t.credits,
      runningBalance: t.runningBalance,
    })),
    referralCode: loyalty.referralCode,
    referralCount: loyalty.referralCount,
    reviewedProducts,
    purchasedProducts,
    birthdayMonth: loyalty.birthdayMonth,
    birthdayClaimed: loyalty.birthdayClaimed,
    joinDate: loyalty.joinDate.toISOString(),
    firstPurchaseCompleted: loyalty.firstPurchaseCompleted,
    referredBy: loyalty.referredBy,
    referredByName,
    lockedCurrency: loyalty.lockedCurrency,
    preferredCurrency: user?.preferredCurrency ?? null,
  });
}
