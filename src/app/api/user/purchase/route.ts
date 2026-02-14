import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productIds, totalSpent, currency } = await request.json();

  if (!productIds?.length || totalSpent == null) {
    return NextResponse.json({ error: "productIds and totalSpent are required" }, { status: 400 });
  }

  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  const creditsEarned = Math.floor(totalSpent);
  const newBalance = loyalty.currentCredits + creditsEarned;
  const newLifetime = loyalty.lifetimeCredits + creditsEarned;
  const newLockedCurrency = loyalty.lockedCurrency ?? (currency || null);

  // Create order with atomic sequential orderNumber
  const order = await prisma.$transaction(async (tx) => {
    const result = await tx.$queryRaw<[{ max: number | null }]>`
      SELECT MAX("orderNumber") as max FROM "Order" FOR UPDATE
    `;
    const nextNumber = (result[0].max ?? 10) + 1;

    return tx.order.create({
      data: {
        userId,
        orderNumber: nextNumber,
        totalAmount: Math.round(totalSpent * 100), // Store in cents
        items: {
          create: productIds.map((pid: string) => ({
            productId: pid,
            quantity: 1,
          })),
        },
      },
    });
  });

  // Update loyalty
  await prisma.loyalty.update({
    where: { userId },
    data: {
      currentCredits: newBalance,
      lifetimeCredits: newLifetime,
      firstPurchaseCompleted: true,
      lockedCurrency: newLockedCurrency,
    },
  });

  // Transaction log
  await prisma.transactionLog.create({
    data: {
      userId,
      action: `Purchase ($${totalSpent.toFixed(2)})`,
      credits: creditsEarned,
      runningBalance: newBalance,
    },
  });

  // Award referrer on first purchase
  if (!loyalty.firstPurchaseCompleted && loyalty.referredBy) {
    const referrerLoyalty = await prisma.loyalty.findUnique({
      where: { referralCode: loyalty.referredBy },
    });

    if (referrerLoyalty) {
      const newReferrerCredits = referrerLoyalty.currentCredits + 200;
      const newReferrerLifetime = referrerLoyalty.lifetimeCredits + 200;

      await prisma.loyalty.update({
        where: { userId: referrerLoyalty.userId },
        data: {
          currentCredits: newReferrerCredits,
          lifetimeCredits: newReferrerLifetime,
          referralCount: referrerLoyalty.referralCount + 1,
        },
      });

      const purchaser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      await prisma.transactionLog.create({
        data: {
          userId: referrerLoyalty.userId,
          action: `Referral reward (${purchaser?.name ?? "a friend"} made first purchase)`,
          credits: 200,
          runningBalance: newReferrerCredits,
        },
      });
    }
  }

  return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber, creditsEarned });
}
