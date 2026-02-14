import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { amount, action, type } = await request.json();

  if (!amount || !action || !type) {
    return NextResponse.json({ error: "amount, action, and type are required" }, { status: 400 });
  }

  const loyalty = await prisma.loyalty.findUnique({ where: { userId } });
  if (!loyalty) {
    return NextResponse.json({ error: "Loyalty record not found" }, { status: 404 });
  }

  if (type === "deduct") {
    if (amount <= 0 || loyalty.currentCredits < amount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }

    const newBalance = loyalty.currentCredits - amount;
    await prisma.loyalty.update({
      where: { userId },
      data: { currentCredits: newBalance },
    });

    await prisma.transactionLog.create({
      data: {
        userId,
        action,
        credits: -amount,
        runningBalance: newBalance,
      },
    });

    return NextResponse.json({ success: true, currentCredits: newBalance });
  }

  if (type === "add") {
    const newBalance = loyalty.currentCredits + amount;
    const newLifetime = loyalty.lifetimeCredits + amount;

    await prisma.loyalty.update({
      where: { userId },
      data: { currentCredits: newBalance, lifetimeCredits: newLifetime },
    });

    await prisma.transactionLog.create({
      data: {
        userId,
        action,
        credits: amount,
        runningBalance: newBalance,
      },
    });

    return NextResponse.json({ success: true, currentCredits: newBalance });
  }

  return NextResponse.json({ error: "Invalid type, must be 'add' or 'deduct'" }, { status: 400 });
}
