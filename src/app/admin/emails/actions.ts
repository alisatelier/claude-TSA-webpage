"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderTemplate, DEFAULT_SUBJECTS } from "@/lib/email/templates";
import type { TemplateData } from "@/lib/email/templates";
import { sampleData } from "@/lib/email/sample-data";
import { sendEmail } from "@/lib/email/send";
import { emailLayout, fillPlaceholders } from "@/lib/email/layout";
import { calculateTier, getTierBenefits } from "@/lib/loyalty-utils";
import { formatOrderNumber } from "@/lib/order-utils";
import { services } from "@/lib/data";

export async function getTestUsers(): Promise<
  { id: string; name: string | null; email: string }[]
> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return [];

  return prisma.user.findMany({
    where: { email: { endsWith: "@test.com" } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

async function buildTemplateDataForUser(
  templateId: string,
  userId: string
): Promise<TemplateData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user) return null;

  const firstName = user.name ?? "Friend";

  switch (templateId) {
    case "account-created": {
      return {
        firstName,
        referralCode: user.loyalty?.referralCode ?? "SPIRIT-PREVIEW",
      };
    }

    case "loyalty-welcome": {
      const tier = user.loyalty
        ? calculateTier(user.loyalty.lifetimeCredits)
        : "Seeker";
      return {
        firstName,
        credits: user.loyalty?.currentCredits ?? 50,
        referralCode: user.loyalty?.referralCode ?? "SPIRIT-PREVIEW",
        tier,
      };
    }

    case "order-confirmation": {
      const order = await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
      if (!order) return null;
      return {
        firstName,
        orderNumber: formatOrderNumber(order.orderNumber),
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.unitPrice / 100,
          variation: item.variation ?? undefined,
        })),
        total: order.totalAmount / 100,
      };
    }

    case "order-shipped": {
      const shipped = await prisma.order.findFirst({
        where: { userId, status: "SHIPPED" },
        orderBy: { createdAt: "desc" },
      });
      const orderForShipped = shipped ?? await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (!orderForShipped) return null;
      return {
        firstName,
        orderNumber: formatOrderNumber(orderForShipped.orderNumber),
        trackingNumber: orderForShipped.trackingNumber ?? "PREVIEW-TRACKING-00000",
      };
    }

    case "service-booking-confirmation": {
      const booking = await prisma.serviceBooking.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (!booking) return null;
      const service = services.find((s) => s.id === booking.serviceId);
      return {
        firstName,
        serviceName: service?.name ?? booking.serviceId,
        date: booking.selectedDate,
        time: booking.selectedTime,
        totalPrice: booking.totalPrice,
      };
    }

    case "service-reminder": {
      const reminderBooking = await prisma.serviceBooking.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (!reminderBooking) return null;
      const reminderService = services.find((s) => s.id === reminderBooking.serviceId);
      return {
        firstName,
        serviceName: reminderService?.name ?? reminderBooking.serviceId,
        date: reminderBooking.selectedDate,
        time: reminderBooking.selectedTime,
        preparationNote:
          "Please find a quiet, comfortable space. Have water nearby and a journal if you'd like to take notes.",
      };
    }

    case "birthday-month": {
      return { firstName, credits: 150 };
    }

    case "referral-completed": {
      return { firstName, referredName: "a friend", creditsEarned: 200 };
    }

    case "status-upgrade": {
      const tier = user.loyalty
        ? calculateTier(user.loyalty.lifetimeCredits)
        : "Seeker";
      return {
        firstName,
        newTier: tier,
        benefits: getTierBenefits(tier),
      };
    }

    default:
      return null;
  }
}

export async function getPreviewHtml(
  templateId: string,
  userId?: string
): Promise<{
  defaultBody?: string;
  savedBody?: string;
  defaultSubject?: string;
  savedSubject?: string;
  variables?: Record<string, string>;
  error?: string;
}> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  let data: TemplateData | null | undefined;
  if (userId) {
    data = await buildTemplateDataForUser(templateId, userId);
  }
  if (!data) {
    data = sampleData[templateId];
  }
  if (!data) return { error: "Unknown template" };

  const { body: defaultBody, variables } = renderTemplate(templateId, data);

  const latest = await prisma.emailTemplateOverride.findFirst({
    where: { templateId },
    orderBy: { createdAt: "desc" },
    select: { body: true, subject: true },
  });

  return {
    defaultBody,
    savedBody: latest?.body ?? undefined,
    defaultSubject: DEFAULT_SUBJECTS[templateId],
    savedSubject: latest?.subject ?? undefined,
    variables,
  };
}

export async function sendTestEmail(
  templateId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  let data: TemplateData | null | undefined;
  if (userId) {
    data = await buildTemplateDataForUser(templateId, userId);
  }
  if (!data) {
    data = sampleData[templateId];
  }
  if (!data) return { success: false, error: "Unknown template" };

  const { subject: defaultSubject, body: defaultBody, variables } = renderTemplate(templateId, data);

  const latest = await prisma.emailTemplateOverride.findFirst({
    where: { templateId },
    orderBy: { createdAt: "desc" },
    select: { body: true, subject: true },
  });

  const bodyToSend = latest?.body ?? defaultBody;
  const subjectToSend = latest?.subject ?? defaultSubject;
  const filledBody = fillPlaceholders(bodyToSend, variables);
  const filledSubject = fillPlaceholders(subjectToSend, variables);
  const html = emailLayout(filledBody);
  return sendEmail({ subject: `[TEST] ${filledSubject}`, html });
}

export async function sendCustomTestEmail(
  templateName: string,
  body: string,
  variables: Record<string, string>,
  subject?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  const filledBody = fillPlaceholders(body, variables);
  const html = emailLayout(filledBody);
  const subjectLine = subject
    ? `[TEST] ${fillPlaceholders(subject, variables)}`
    : `[TEST] ${templateName}`;
  return sendEmail({ subject: subjectLine, html });
}

export async function saveTemplateOverride(
  templateId: string,
  body: string,
  subject?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  await prisma.emailTemplateOverride.create({
    data: {
      templateId,
      body,
      subject: subject ?? null,
      savedBy: session.user.email ?? session.user.id,
    },
  });

  return { success: true };
}

export interface OverrideVersion {
  id: string;
  savedBy: string;
  createdAt: string;
  hasSubjectOverride: boolean;
}

export async function getTemplateHistory(
  templateId: string
): Promise<{ versions?: OverrideVersion[]; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const overrides = await prisma.emailTemplateOverride.findMany({
    where: { templateId },
    orderBy: { createdAt: "desc" },
    select: { id: true, savedBy: true, createdAt: true, subject: true },
  });

  return {
    versions: overrides.map((o) => ({
      id: o.id,
      savedBy: o.savedBy,
      createdAt: o.createdAt.toISOString(),
      hasSubjectOverride: o.subject !== null,
    })),
  };
}

export async function getOverrideBody(
  overrideId: string
): Promise<{ body?: string; subject?: string; error?: string }> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

  const override = await prisma.emailTemplateOverride.findUnique({
    where: { id: overrideId },
    select: { body: true, subject: true },
  });

  return {
    body: override?.body ?? undefined,
    subject: override?.subject ?? undefined,
  };
}
