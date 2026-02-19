import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      category: true,
      excerpt: true,
      image: true,
    },
  });

  return NextResponse.json({ posts });
}
