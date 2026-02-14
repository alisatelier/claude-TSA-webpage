import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviews as staticReviews, products } from "@/lib/data";

export async function GET() {
  const userReviews = await prisma.review.findMany({
    where: { approved: true },
    select: { productId: true, rating: true },
  });

  const ratings: Record<string, { average: number; count: number }> = {};

  for (const product of products) {
    const productStatic = staticReviews.filter((r) => r.productId === product.id);
    const productUser = userReviews.filter((r) => r.productId === product.id);

    const allRatings = [
      ...productStatic.map((r) => r.rating),
      ...productUser.map((r) => r.rating),
    ];

    if (allRatings.length > 0) {
      const sum = allRatings.reduce((a, b) => a + b, 0);
      ratings[product.id] = {
        average: Math.round((sum / allRatings.length) * 10) / 10,
        count: allRatings.length,
      };
    } else {
      ratings[product.id] = { average: 0, count: 0 };
    }
  }

  return NextResponse.json({ ratings });
}
