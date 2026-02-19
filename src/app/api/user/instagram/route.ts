import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { triggerAdminInstagramHandleEmail } from "@/lib/email/trigger";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  let handle = typeof body.handle === "string" ? body.handle.trim() : "";

  // Strip leading @ if present
  if (handle.startsWith("@")) {
    handle = handle.slice(1);
  }

  if (!handle) {
    return NextResponse.json({ error: "Instagram handle is required" }, { status: 400 });
  }

  const userId = session.user.id;

  await prisma.loyalty.update({
    where: { userId },
    data: { instagramHandle: handle },
  });

  // Send notification email to admin
  triggerAdminInstagramHandleEmail(userId, handle);

  return NextResponse.json({ instagramHandle: handle });
}
