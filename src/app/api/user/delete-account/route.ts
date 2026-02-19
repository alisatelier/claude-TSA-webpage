import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { confirmEmail } = await request.json();

  if (!confirmEmail || confirmEmail.toLowerCase() !== session.user.email.toLowerCase()) {
    return NextResponse.json({ error: "Email does not match" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Detach orders and bookings so they remain visible in admin
  // then delete user-specific data and the user record
  await prisma.$transaction([
    prisma.order.updateMany({ where: { userId: user.id }, data: { userId: null } }),
    prisma.transactionLog.deleteMany({ where: { userId: user.id } }),
    prisma.ritualCreditLog.deleteMany({ where: { userId: user.id } }),
    prisma.review.deleteMany({ where: { userId: user.id } }),
    prisma.wishlist.deleteMany({ where: { userId: user.id } }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
    prisma.account.deleteMany({ where: { userId: user.id } }),
    prisma.loyalty.deleteMany({ where: { userId: user.id } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);

  return NextResponse.json({ success: true });
}
