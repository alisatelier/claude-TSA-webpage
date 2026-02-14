import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  const where: Record<string, unknown> = {};
  if (productId) where.productId = productId;

  const stocks = await prisma.productStock.findMany({ where });

  const stockMap: Record<string, Record<string, number>> = {};
  for (const s of stocks) {
    if (!stockMap[s.productId]) stockMap[s.productId] = {};
    stockMap[s.productId][s.variation ?? "_default"] = s.stock;
  }

  return NextResponse.json({ stock: stockMap });
}
