import { prisma } from "@/lib/prisma";
import { renderTemplate, DEFAULT_SUBJECTS, type TemplateData } from "./templates";
import { sendEmail } from "./send";
import { emailLayout, fillPlaceholders } from "./layout";
import { calculateTier, getTierBenefits } from "@/lib/loyalty-utils";
import { formatOrderNumber } from "@/lib/order-utils";
import { services } from "@/lib/data";

// ── Helpers ─────────────────────────────────────────────────────────

async function resolveOverride(templateId: string) {
  const override = await prisma.emailTemplateOverride.findFirst({
    where: { templateId },
    orderBy: { createdAt: "desc" },
    select: { body: true, subject: true },
  });
  return {
    bodyOverride: override?.body ?? null,
    subjectOverride: override?.subject ?? null,
  };
}

async function buildAndSend(
  templateId: string,
  data: TemplateData,
  recipientEmail: string
) {
  try {
    const rendered = renderTemplate(templateId, data);
    const { bodyOverride, subjectOverride } = await resolveOverride(templateId);

    const body = bodyOverride ?? rendered.body;
    const subjectTemplate = subjectOverride ?? DEFAULT_SUBJECTS[templateId] ?? rendered.subject;

    const filledBody = fillPlaceholders(body, rendered.variables);
    const filledSubject = fillPlaceholders(subjectTemplate, rendered.variables);
    const html = emailLayout(filledBody);

    await sendEmail({ to: recipientEmail, subject: filledSubject, html });
  } catch (err) {
    console.error(`[email-trigger] Failed to send ${templateId}:`, err);
  }
}

// ── Trigger Functions ───────────────────────────────────────────────

export async function triggerAccountCreatedEmail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user?.email || !user.loyalty) return;

  await buildAndSend(
    "account-created",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      referralCode: user.loyalty.referralCode,
    },
    user.email
  );
}

export async function triggerLoyaltyWelcomeEmail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user?.email || !user.loyalty) return;

  const tier = calculateTier(user.loyalty.lifetimeCredits);

  await buildAndSend(
    "loyalty-welcome",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      credits: user.loyalty.currentCredits,
      referralCode: user.loyalty.referralCode,
      tier,
    },
    user.email
  );
}

export async function triggerOrderConfirmationEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
  });
  if (!order?.user?.email) return;

  await buildAndSend(
    "order-confirmation",
    {
      firstName: order.user.name?.split(" ")[0] ?? "there",
      orderNumber: formatOrderNumber(order.orderNumber),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice / 100,
        variation: item.variation ?? undefined,
      })),
      total: order.totalAmount / 100,
    },
    order.user.email
  );
}

export async function triggerOrderShippedEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { email: true, name: true } },
    },
  });
  if (!order?.user?.email || !order.trackingNumber) return;

  await buildAndSend(
    "order-shipped",
    {
      firstName: order.user.name?.split(" ")[0] ?? "there",
      orderNumber: formatOrderNumber(order.orderNumber),
      trackingNumber: order.trackingNumber,
    },
    order.user.email
  );
}

export async function triggerServiceBookingConfirmationEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "service-booking-confirmation",
    {
      firstName: booking.userName.split(" ")[0] ?? "there",
      serviceName: service?.name ?? booking.serviceId,
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
    },
    booking.userEmail
  );
}

export async function triggerServiceReminderEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "service-reminder",
    {
      firstName: booking.userName.split(" ")[0] ?? "there",
      serviceName: service?.name ?? booking.serviceId,
      date: booking.selectedDate,
      time: booking.selectedTime,
    },
    booking.userEmail
  );
}

export async function triggerBirthdayMonthEmail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) return;

  await buildAndSend(
    "birthday-month",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      credits: 150,
    },
    user.email
  );
}

export async function triggerReferralCompletedEmail(
  userId: string,
  referredName: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user?.email) return;

  await buildAndSend(
    "referral-completed",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      referredName,
      creditsEarned: 200,
    },
    user.email
  );
}

export async function triggerStatusUpgradeEmail(userId: string, newTier: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) return;

  const benefits = getTierBenefits(newTier as "Seeker" | "Keeper" | "Elder");

  await buildAndSend(
    "status-upgrade",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      newTier,
      benefits,
    },
    user.email
  );
}
