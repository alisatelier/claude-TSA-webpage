import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { triggerAccountCreatedEmail, triggerLoyaltyWelcomeEmail } from "@/lib/email/trigger";

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

    // Capitalize first letter of name
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const refCode = generateReferralCode(capitalizedName);

    let referredBy: string | null = null;
    let referrerName: string | null = null;

    if (referralCode) {
      const referrerLoyalty = await prisma.loyalty.findUnique({
        where: { referralCode },
        include: { user: { select: { name: true } } },
      });
      if (referrerLoyalty) {
        referredBy = referralCode;
        referrerName = referrerLoyalty.user.name;
      }
    }

    const welcomeCredits = 50;
    const referralBonus = referredBy ? 200 : 0;
    const initialCredits = welcomeCredits + referralBonus;

    const user = await prisma.user.create({
      data: {
        name: capitalizedName,
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

    // Referral bonus for the new user only — referrer gets credited on first purchase
    if (referredBy) {
      await prisma.transactionLog.create({
        data: {
          userId: user.id,
          action: `Referral bonus (referred by ${referrerName ?? "a friend"})`,
          credits: referralBonus,
          runningBalance: initialCredits,
        },
      });
    }

    // Fire-and-forget email triggers
    triggerAccountCreatedEmail(user.id);
    triggerLoyaltyWelcomeEmail(user.id);

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
