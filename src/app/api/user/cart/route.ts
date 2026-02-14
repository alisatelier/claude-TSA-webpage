import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });

  return NextResponse.json({
    items: (cart?.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      cadPrice: item.cadPrice,
      quantity: item.quantity,
      variation: item.variation,
      image: item.image,
      isService: item.isService,
      holdId: item.holdId,
      selectedDate: item.selectedDate,
      selectedTime: item.selectedTime,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { items } = await request.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  // Upsert cart
  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  // Upsert each item
  for (const item of items) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId_variation: {
          cartId: cart.id,
          productId: item.productId,
          variation: item.variation ?? null,
        },
      },
      create: {
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
      update: {
        quantity: item.quantity,
        price: item.price,
        cadPrice: item.cadPrice ?? null,
        name: item.name,
        image: item.image,
        isService: item.isService ?? false,
        holdId: item.holdId ?? null,
        selectedDate: item.selectedDate ?? null,
        selectedTime: item.selectedTime ?? null,
      },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const variation = url.searchParams.get("variation");

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) {
    return NextResponse.json({ success: true });
  }

  if (productId) {
    // Delete specific item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
        variation: variation ?? null,
      },
    });
  } else {
    // Clear entire cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return NextResponse.json({ success: true });
}
