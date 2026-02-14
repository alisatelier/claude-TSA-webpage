import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productId, rating, text } = await request.json();

  if (!productId || !rating || !text) {
    return NextResponse.json({ error: "productId, rating, and text are required" }, { status: 400 });
  }

  if (text.length < 100) {
    return NextResponse.json({ error: "Review must be at least 100 characters" }, { status: 400 });
  }

  // Check if user purchased this product
  const purchased = await prisma.orderItem.findFirst({
    where: { order: { userId }, productId },
  });
  if (!purchased) {
    return NextResponse.json({ error: "You must purchase this product before reviewing" }, { status: 403 });
  }

  // Check uniqueness
  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existingReview) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  // Create review
  await prisma.review.create({
    data: { userId, productId, rating, text },
  });

  // Award credits
  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (loyalty) {
    const reviewCredits = 100;
    const newBalance = loyalty.currentCredits + reviewCredits;
    const newLifetime = loyalty.lifetimeCredits + reviewCredits;

    await prisma.loyalty.update({
      where: { userId },
      data: { currentCredits: newBalance, lifetimeCredits: newLifetime },
    });

    await prisma.transactionLog.create({
      data: {
        userId,
        action: "Review submitted",
        credits: reviewCredits,
        runningBalance: newBalance,
      },
    });
  }

  return NextResponse.json({ success: true });
}
