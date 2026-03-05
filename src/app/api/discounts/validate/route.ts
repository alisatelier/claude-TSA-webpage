import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { code, subtotal } = await request.json();

  if (!code || subtotal == null) {
    return NextResponse.json({ valid: false, error: "Code and subtotal are required" });
  }

  const normalized = String(code).trim().toUpperCase();

  const discountCode = await prisma.discountCode.findUnique({
    where: { code: normalized },
  });

  if (!discountCode) {
    return NextResponse.json({ valid: false, error: "Invalid discount code" });
  }

  if (!discountCode.active) {
    return NextResponse.json({ valid: false, error: "This code is no longer active" });
  }

  if (discountCode.expiresAt && discountCode.expiresAt <= new Date()) {
    return NextResponse.json({ valid: false, error: "This code has expired" });
  }

  if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
    return NextResponse.json({ valid: false, error: "This code has reached its usage limit" });
  }

  // Per-customer limit check
  if (discountCode.maxUsesPerCustomer) {
    const session = await auth();
    const userId = session?.user?.id;
    if (userId) {
      const [orderUses, bookingUses] = await Promise.all([
        prisma.order.count({ where: { userId, discountCode: normalized } }),
        prisma.serviceBooking.count({ where: { userId, discountCode: normalized, status: { not: "CANCELLED" } } }),
      ]);
      if (orderUses + bookingUses >= discountCode.maxUsesPerCustomer) {
        return NextResponse.json({ valid: false, error: "You've already used this code the maximum number of times" });
      }
    }
  }

  let discountAmount: number;
  if (discountCode.type === "PERCENTAGE") {
    discountAmount = Math.round(subtotal * discountCode.value / 100 * 100) / 100;
    discountAmount = Math.min(discountAmount, subtotal);
  } else {
    discountAmount = Math.min(discountCode.value, subtotal);
  }

  return NextResponse.json({
    valid: true,
    type: discountCode.type,
    value: discountCode.value,
    discountAmount,
    code: discountCode.code,
  });
}
