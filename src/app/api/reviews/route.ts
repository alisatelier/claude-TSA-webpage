import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatReviewerName(name: string | null): string {
  if (!name) return "Anonymous";
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

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
      userName: formatReviewerName(r.user.name),
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
