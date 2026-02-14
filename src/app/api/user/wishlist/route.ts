import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    select: { productId: true, variation: true },
  });

  return NextResponse.json({
    items: items.map((w) => ({
      productId: w.productId,
      variation: w.variation || undefined,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { productId, variation } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const variationKey = variation || "";

  // Toggle: if exists, remove; otherwise, add
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId_variation: { userId, productId, variation: variationKey } },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { userId_productId_variation: { userId, productId, variation: variationKey } },
    });
    return NextResponse.json({ action: "removed" });
  }

  await prisma.wishlist.create({
    data: { userId, productId, variation: variationKey },
  });

  return NextResponse.json({ action: "added" });
}
