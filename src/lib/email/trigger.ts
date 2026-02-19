import { prisma } from "@/lib/prisma";
import { renderTemplate, DEFAULT_SUBJECTS, type TemplateData } from "./templates";
import { sendEmail } from "./send";
import { emailLayout, fillPlaceholders } from "./layout";
import { calculateTier, getTierBenefits } from "@/lib/loyalty-utils";
import { formatOrderNumber, resolveProduct } from "@/lib/order-utils";
import { services, products } from "@/lib/data";

// ── Email preference categories (opt-out only) ─────────────────────

const TEMPLATE_CATEGORY: Record<string, "loyalty" | "newsletters_promotions"> = {
  "loyalty-welcome": "loyalty",
  "birthday-month": "loyalty",
  "referral-completed": "loyalty",
  "status-upgrade": "loyalty",
  "wishlist-back-in-stock": "newsletters_promotions",
};

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
  recipientEmail?: string,
  userId?: string | null
) {
  try {
    // Check opt-out preference if this template has a category
    const category = TEMPLATE_CATEGORY[templateId];
    if (category && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { emailLoyalty: true, emailNewsletters: true },
      });
      if (user) {
        const optedOut =
          (category === "loyalty" && !user.emailLoyalty) ||
          (category === "newsletters_promotions" && !user.emailNewsletters);
        if (optedOut) return;
      }
    }

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

export async function triggerWishlistBackInStockEmail(
  userId: string,
  productId: string,
  variation?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user?.email) return;

  const resolved = resolveProduct(productId, variation);
  const product = products.find((p) => p.id === productId);

  await buildAndSend(
    "wishlist-back-in-stock",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      productName: resolved.name,
      productImage: resolved.image,
      variation,
      price: product?.price ?? 0,
      productUrl: `https://www.thespiritatelier.ca/shop/${productId}`,
    },
    user.email,
    userId
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
    user.email,
    userId
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
      meetLink: booking.googleMeetLink ?? undefined,
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
      meetLink: booking.googleMeetLink ?? undefined,
    },
    booking.userEmail
  );

  // Also send admin reminder
  triggerAdminBookingReminderEmail(bookingId);
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
    user.email,
    userId
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
      credits: user.loyalty?.currentCredits ?? 0,
    },
    user.email,
    userId
  );
}

export async function triggerStatusUpgradeEmail(userId: string, newTier: string) {
  if (newTier !== "Keeper" && newTier !== "Elder") return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user?.email) return;

  const benefits = getTierBenefits(newTier as "Seeker" | "Keeper" | "Elder");

  await buildAndSend(
    "status-upgrade",
    {
      firstName: user.name?.split(" ")[0] ?? "there",
      newTier,
      benefits,
      credits: user.loyalty?.currentCredits ?? 0,
      lifetimeCredits: user.loyalty?.lifetimeCredits ?? 0,
    },
    user.email,
    userId
  );
}

export async function triggerBookingCancellationEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "booking-cancellation",
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

export async function triggerBookingRescheduleEmail(
  bookingId: string,
  oldDate: string,
  oldTime: string
) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "booking-reschedule",
    {
      firstName: booking.userName.split(" ")[0] ?? "there",
      serviceName: service?.name ?? booking.serviceId,
      oldDate,
      oldTime,
      newDate: booking.selectedDate,
      newTime: booking.selectedTime,
      totalPrice: booking.totalPrice,
      meetLink: booking.googleMeetLink ?? undefined,
    },
    booking.userEmail
  );
}

// ── Admin Trigger Functions ──────────────────────────────────────────

export async function triggerAdminNewOrderEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: { select: { email: true, name: true } },
    },
  });
  if (!order?.user) return;

  await buildAndSend(
    "admin-new-order",
    {
      customerName: order.user.name ?? "Unknown",
      customerEmail: order.user.email ?? "N/A",
      orderNumber: formatOrderNumber(order.orderNumber),
      orderItems: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice / 100,
        variation: item.variation ?? undefined,
      })),
      total: order.totalAmount / 100,
    },
  );
}

export async function triggerAdminNewBookingEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "admin-new-booking",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: service?.name ?? booking.serviceId,
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
      notes: booking.userNotes || undefined,
      meetLink: booking.googleMeetLink ?? undefined,
    },
  );
}

export async function triggerAdminBookingReminderEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "admin-booking-reminder",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: service?.name ?? booking.serviceId,
      date: booking.selectedDate,
      time: booking.selectedTime,
      meetLink: booking.googleMeetLink ?? undefined,
    },
  );
}

export async function triggerAdminBookingCancellationEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "admin-booking-cancellation",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: service?.name ?? booking.serviceId,
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
    },
  );
}

export async function triggerAdminBookingRescheduleEmail(
  bookingId: string,
  oldDate: string,
  oldTime: string
) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  const service = services.find((s) => s.id === booking.serviceId);

  await buildAndSend(
    "admin-booking-reschedule",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: service?.name ?? booking.serviceId,
      oldDate,
      oldTime,
      newDate: booking.selectedDate,
      newTime: booking.selectedTime,
      totalPrice: booking.totalPrice,
    },
  );
}

export async function triggerAdminInstagramHandleEmail(userId: string, handle: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyalty: true },
  });
  if (!user) return;

  const tier = calculateTier(user.loyalty?.lifetimeCredits ?? 0);

  await buildAndSend(
    "admin-instagram-handle",
    {
      customerName: user.name ?? "Unknown",
      customerEmail: user.email ?? "N/A",
      tier,
      instagramHandle: handle,
    },
  );
}
