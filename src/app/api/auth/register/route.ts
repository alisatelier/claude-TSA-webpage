import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function generateReferralCode(name: string): string {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4) || "USER";
  const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `REF-${cleanName}-${hex}`;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, referralCode, birthdayMonth } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const refCode = generateReferralCode(name);

    let referredBy: string | null = null;
    let referrerUserId: string | null = null;

    if (referralCode) {
      const referrerLoyalty = await prisma.loyalty.findUnique({
        where: { referralCode },
        include: { user: true },
      });
      if (referrerLoyalty) {
        referredBy = referralCode;
        referrerUserId = referrerLoyalty.userId;
      }
    }

    const welcomeCredits = 50;
    const referralBonus = referredBy ? 200 : 0;
    const initialCredits = welcomeCredits + referralBonus;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CUSTOMER",
        loyalty: {
          create: {
            currentCredits: initialCredits,
            lifetimeCredits: initialCredits,
            referralCode: refCode,
            referredBy,
            birthdayMonth: birthdayMonth && birthdayMonth >= 1 && birthdayMonth <= 12 ? birthdayMonth : null,
          },
        },
      },
      include: { loyalty: true },
    });

    // Create welcome credits transaction log
    await prisma.transactionLog.create({
      data: {
        userId: user.id,
        action: "Welcome bonus",
        credits: welcomeCredits,
        runningBalance: welcomeCredits,
      },
    });

    // Referral bonus entries
    if (referredBy && referrerUserId) {
      // Transaction for new user
      await prisma.transactionLog.create({
        data: {
          userId: user.id,
          action: "Referral bonus (referred by friend)",
          credits: referralBonus,
          runningBalance: initialCredits,
        },
      });

      // Award referrer
      const referrerLoyalty = await prisma.loyalty.findUnique({
        where: { userId: referrerUserId },
      });

      if (referrerLoyalty) {
        const newReferrerCredits = referrerLoyalty.currentCredits + 200;
        const newReferrerLifetime = referrerLoyalty.lifetimeCredits + 200;

        await prisma.loyalty.update({
          where: { userId: referrerUserId },
          data: {
            currentCredits: newReferrerCredits,
            lifetimeCredits: newReferrerLifetime,
            referralCount: referrerLoyalty.referralCount + 1,
          },
        });

        await prisma.transactionLog.create({
          data: {
            userId: referrerUserId,
            action: `Referral reward (${name} joined)`,
            credits: 200,
            runningBalance: newReferrerCredits,
          },
        });
      }
    }

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
