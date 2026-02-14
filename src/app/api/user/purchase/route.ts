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

  // Create order
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount: Math.round(totalSpent * 100), // Store in cents
      items: {
        create: productIds.map((pid: string) => ({
          productId: pid,
          quantity: 1,
        })),
      },
    },
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

  return NextResponse.json({ success: true, orderId: order.id, creditsEarned });
}
