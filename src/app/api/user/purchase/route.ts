import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateTier } from "@/lib/loyalty-utils";
import {
  triggerOrderConfirmationEmail,
  triggerAdminNewOrderEmail,
  triggerReferralCompletedEmail,
  triggerStatusUpgradeEmail,
} from "@/lib/email/trigger";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productIds, items, totalSpent, currency, discountCode, discountAmountCents, creditsRedeemed } = await request.json();

  // Accept either `items` (new format) or `productIds` (legacy)
  if ((!items?.length && !productIds?.length) || totalSpent == null) {
    return NextResponse.json({ error: "items (or productIds) and totalSpent are required" }, { status: 400 });
  }

  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  const creditsEarned = Math.floor(totalSpent);
  const newBalance = loyalty.currentCredits + creditsEarned;
  const newLifetime = loyalty.lifetimeCredits + creditsEarned;
  const newLockedCurrency = loyalty.lockedCurrency ?? (currency || null);

  // Create order with sequential orderNumber
  const order = await prisma.$transaction(async (tx) => {
    const lastOrder = await tx.order.findFirst({
      orderBy: { orderNumber: "desc" },
      select: { orderNumber: true },
    });
    const nextNumber = (lastOrder?.orderNumber ?? 10) + 1;

    const orderItems = items
      ? items.map((item: { productId: string; name: string; unitPrice: number; quantity: number; variation?: string; image: string }) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
          unitPrice: item.unitPrice,
          variation: item.variation ?? null,
          image: item.image,
        }))
      : productIds.map((pid: string) => ({
          productId: pid,
          quantity: 1,
        }));

    const order = await tx.order.create({
      data: {
        user: { connect: { id: userId } },
        orderNumber: nextNumber,
        totalAmount: Math.round(totalSpent * 100), // Store in cents
        discountCode: discountCode ?? null,
        discountAmount: discountAmountCents ?? 0,
        creditsRedeemed: creditsRedeemed ?? 0,
        items: { create: orderItems },
      },
    });

    // Increment discount code usage
    if (discountCode) {
      await tx.discountCode.updateMany({
        where: { code: discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Decrement stock for each ordered item
    for (const item of orderItems) {
      const variation = item.variation ?? "_default";
      try {
        await tx.productStock.update({
          where: {
            productId_variation: {
              productId: item.productId,
              variation,
            },
          },
          data: { stock: { decrement: item.quantity } },
        });
      } catch {
        // Stock entry may not exist — skip
      }
    }

    return order;
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

  // Award referrer on first purchase (one-time reward only)
  if (!loyalty.firstPurchaseCompleted && loyalty.referredBy) {
    const referrerLoyalty = await prisma.loyalty.findUnique({
      where: { referralCode: loyalty.referredBy },
    });

    if (referrerLoyalty) {
      // Always track the referral count
      const isFirstReferral = referrerLoyalty.referralCount === 0;

      if (isFirstReferral) {
        // Only award 200 points for the very first referred friend's purchase
        const newReferrerCredits = referrerLoyalty.currentCredits + 200;
        const newReferrerLifetime = referrerLoyalty.lifetimeCredits + 200;

        await prisma.loyalty.update({
          where: { userId: referrerLoyalty.userId },
          data: {
            currentCredits: newReferrerCredits,
            lifetimeCredits: newReferrerLifetime,
            referralCount: 1,
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
      } else {
        // Still increment referral count for tracking, but no points
        await prisma.loyalty.update({
          where: { userId: referrerLoyalty.userId },
          data: { referralCount: referrerLoyalty.referralCount + 1 },
        });
      }
    }
  }

  // Fire-and-forget email triggers
  triggerOrderConfirmationEmail(order.id);
  triggerAdminNewOrderEmail(order.id);

  // Send referral reward email only for the first referred friend's purchase
  if (!loyalty.firstPurchaseCompleted && loyalty.referredBy) {
    const referrerLoyalty2 = await prisma.loyalty.findUnique({
      where: { referralCode: loyalty.referredBy },
      select: { userId: true, referralCount: true },
    });
    // referralCount was just set to 1 above if this was the first referral
    if (referrerLoyalty2 && referrerLoyalty2.referralCount === 1) {
      const purchaserUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      triggerReferralCompletedEmail(
        referrerLoyalty2.userId,
        purchaserUser?.name ?? "a friend"
      );
    }
  }

  // Check for tier upgrade
  const tierBefore = calculateTier(loyalty.lifetimeCredits);
  const tierAfter = calculateTier(newLifetime);
  if (tierAfter !== tierBefore) {
    triggerStatusUpgradeEmail(userId, tierAfter);
  }

  // Remove purchased items from wishlist
  const orderItems = items ?? productIds.map((pid: string) => ({ productId: pid, variation: null }));
  for (const item of orderItems) {
    const variation = item.variation ?? "";
    try {
      await prisma.wishlist.delete({
        where: {
          userId_productId_variation: { userId, productId: item.productId, variation },
        },
      });
    } catch {
      // Wishlist entry may not exist — skip
    }
  }

  revalidatePath("/admin/orders");

  return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber, creditsEarned });
}
