import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { items } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: true });
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: { items: true },
  });

  for (const item of items) {
    const existingItem = cart.items.find(
      (ci) => ci.productId === item.productId && ci.variation === (item.variation ?? null)
    );

    if (existingItem) {
      // Merge quantities
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          cadPrice: item.cadPrice ?? null,
          quantity: item.quantity,
          variation: item.variation ?? null,
          image: item.image,
          isService: item.isService ?? false,
          holdId: item.holdId ?? null,
          selectedDate: item.selectedDate ?? null,
          selectedTime: item.selectedTime ?? null,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
