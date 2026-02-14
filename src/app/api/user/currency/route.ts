import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currency } = await request.json();
  const valid = ["CAD", "USD", "GBP", "AUD", "EUR"];
  if (!valid.includes(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredCurrency: currency },
  });

  return NextResponse.json({ success: true });
}
