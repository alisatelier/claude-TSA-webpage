import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface MigrationData {
  loyalty?: {
    currentCredits?: number;
    lifetimeCredits?: number;
    referralCount?: number;
    birthdayMonth?: number | null;
    birthdayClaimed?: number | null;
    firstPurchaseCompleted?: boolean;
    referredBy?: string | null;
    lockedCurrency?: string | null;
    purchasedProducts?: string[];
    reviewedProducts?: string[];
    pointsHistory?: Array<{
      date: string;
      action: string;
      credits: number;
      runningBalance: number;
    }>;
  };
  reviews?: Array<{
    productId: string;
    rating: number;
    text: string;
    createdAt: string;
  }>;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const data: MigrationData = await request.json();

  // Only migrate if loyalty record has default values (never been migrated)
  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  // Skip if already has meaningful data (not fresh from registration)
  const existingLogs = await prisma.transactionLog.count({ where: { userId } });
  // Allow migration only if user only has the initial welcome/referral entries
  if (existingLogs > 3) {
    return NextResponse.json({ message: "Already migrated" });
  }

  if (data.loyalty) {
    await prisma.loyalty.update({
      where: { userId },
      data: {
        currentCredits: data.loyalty.currentCredits ?? loyalty.currentCredits,
        lifetimeCredits: data.loyalty.lifetimeCredits ?? loyalty.lifetimeCredits,
        referralCount: data.loyalty.referralCount ?? loyalty.referralCount,
        birthdayMonth: data.loyalty.birthdayMonth !== undefined ? data.loyalty.birthdayMonth : loyalty.birthdayMonth,
        birthdayClaimed: data.loyalty.birthdayClaimed !== undefined ? data.loyalty.birthdayClaimed : loyalty.birthdayClaimed,
        firstPurchaseCompleted: data.loyalty.firstPurchaseCompleted ?? loyalty.firstPurchaseCompleted,
        lockedCurrency: data.loyalty.lockedCurrency !== undefined ? data.loyalty.lockedCurrency : loyalty.lockedCurrency,
      },
    });

    // Import history
    if (data.loyalty.pointsHistory?.length) {
      // Clear existing transaction logs (from registration) and replace
      await prisma.transactionLog.deleteMany({ where: { userId } });
      await prisma.transactionLog.createMany({
        data: data.loyalty.pointsHistory.map((entry) => ({
          userId,
          action: entry.action,
          credits: entry.credits,
          runningBalance: entry.runningBalance,
          createdAt: new Date(entry.date),
        })),
      });
    }

    // Import purchased products as orders
    if (data.loyalty.purchasedProducts?.length) {
      const existingOrders = await prisma.order.count({ where: { userId } });
      if (existingOrders === 0) {
        await prisma.$transaction(async (tx) => {
          const result = await tx.$queryRaw<[{ max: number | null }]>`
            SELECT MAX("orderNumber") as max FROM "Order" FOR UPDATE
          `;
          const nextNumber = (result[0].max ?? 10) + 1;

          await tx.order.create({
            data: {
              userId,
              orderNumber: nextNumber,
              totalAmount: 0,
              status: "COMPLETED",
              items: {
                create: data.loyalty!.purchasedProducts!.map((pid) => ({
                  productId: pid,
                  quantity: 1,
                })),
              },
            },
          });
        });
      }
    }
  }

  // Import reviews
  if (data.reviews?.length) {
    for (const review of data.reviews) {
      const exists = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId: review.productId } },
      });
      if (!exists) {
        await prisma.review.create({
          data: {
            userId,
            productId: review.productId,
            rating: review.rating,
            text: review.text,
            createdAt: new Date(review.createdAt),
          },
        });
      }
    }
  }

  return NextResponse.json({ success: true });
}
