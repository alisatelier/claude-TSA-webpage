import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      userName: r.user.name || "Anonymous",
      userEmail: r.user.email,
      productId: r.productId,
      rating: r.rating,
      text: r.text,
      createdAt: r.createdAt.toISOString(),
      adminResponse: r.adminResponse,
      adminResponseAt: r.adminResponseAt?.toISOString() ?? null,
    })),
  });
}
