import { prisma } from "@/lib/prisma";
import { renderTemplate, DEFAULT_SUBJECTS, type TemplateData } from "./templates";
import { sendEmail } from "./send";
import { emailLayout, fillPlaceholders } from "./layout";
import { hardcodedOverrides } from "./hardcoded-overrides";
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

function calculateCreditDiscount(credits: number): number {
  return credits === 500 ? 10 : credits === 250 ? 5 : 0;
}

function getFirstName(name?: string | null): string {
  return name?.split(" ")[0] ?? "there";
}

function getServiceName(serviceId: string): string {
  return services.find((s) => s.id === serviceId)?.name ?? serviceId;
}

async function resolveOverride(templateId: string) {
  const override = await prisma.emailTemplateOverride.findFirst({
    where: { templateId },
    orderBy: { createdAt: "desc" },
    select: { body: true, subject: true },
  });
  const hardcoded = hardcodedOverrides[templateId];
  return {
    bodyOverride: override?.body ?? hardcoded?.body ?? null,
    subjectOverride: override?.subject ?? hardcoded?.subject ?? null,
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
      firstName: getFirstName(user.name),
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

export async function triggerAdminNewReviewEmail(
  userId: string,
  productId: string,
  rating: number,
  reviewText: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });
  if (!user) return;

  const product = products.find((p) => p.id === productId);

  await buildAndSend("admin-new-review", {
    customerName: user.name ?? "Unknown",
    customerEmail: user.email ?? "N/A",
    productName: product?.name ?? productId,
    productId,
    rating,
    reviewText,
  });
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
      firstName: getFirstName(user.name),
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

  const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) / 100;
  const discountAmountDollars = order.discountAmount / 100;
  const creditDiscount = calculateCreditDiscount(order.creditsRedeemed);
  const hasDeductions = discountAmountDollars > 0 || creditDiscount > 0;

  await buildAndSend(
    "order-confirmation",
    {
      firstName: getFirstName(order.user.name),
      orderNumber: formatOrderNumber(order.orderNumber),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unitPrice / 100,
        variation: item.variation ?? undefined,
      })),
      total: order.totalAmount / 100,
      ...(hasDeductions ? {
        subtotal: itemsSubtotal,
        discountCode: order.discountCode ?? undefined,
        discountAmount: discountAmountDollars || undefined,
        creditsRedeemed: order.creditsRedeemed || undefined,
        creditDiscount: creditDiscount || undefined,
      } : {}),
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
      firstName: getFirstName(order.user.name),
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

  await buildAndSend(
    "service-booking-confirmation",
    {
      firstName: getFirstName(booking.userName),
      serviceName: getServiceName(booking.serviceId),
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
      meetLink: booking.googleMeetLink ?? undefined,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
    },
    booking.userEmail
  );
}

export async function triggerServiceReminderEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  await buildAndSend(
    "service-reminder",
    {
      firstName: getFirstName(booking.userName),
      serviceName: getServiceName(booking.serviceId),
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
      firstName: getFirstName(user.name),
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
      firstName: getFirstName(user.name),
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
      firstName: getFirstName(user.name),
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

  await buildAndSend(
    "booking-cancellation",
    {
      firstName: getFirstName(booking.userName),
      serviceName: getServiceName(booking.serviceId),
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
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

  await buildAndSend(
    "booking-reschedule",
    {
      firstName: getFirstName(booking.userName),
      serviceName: getServiceName(booking.serviceId),
      oldDate,
      oldTime,
      newDate: booking.selectedDate,
      newTime: booking.selectedTime,
      totalPrice: booking.totalPrice,
      meetLink: booking.googleMeetLink ?? undefined,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
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

  const itemsSubtotal = order.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) / 100;
  const discountAmountDollars = order.discountAmount / 100;
  const creditDiscount = calculateCreditDiscount(order.creditsRedeemed);
  const hasDeductions = discountAmountDollars > 0 || creditDiscount > 0;

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
      ...(hasDeductions ? {
        subtotal: itemsSubtotal,
        discountCode: order.discountCode ?? undefined,
        discountAmount: discountAmountDollars || undefined,
        creditsRedeemed: order.creditsRedeemed || undefined,
        creditDiscount: creditDiscount || undefined,
      } : {}),
    },
  );
}

export async function triggerAdminNewBookingEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  await buildAndSend(
    "admin-new-booking",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: getServiceName(booking.serviceId),
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
      notes: booking.userNotes || undefined,
      meetLink: booking.googleMeetLink ?? undefined,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
    },
  );
}

export async function triggerAdminBookingReminderEmail(bookingId: string) {
  const booking = await prisma.serviceBooking.findUnique({
    where: { id: bookingId },
  });
  if (!booking) return;

  await buildAndSend(
    "admin-booking-reminder",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: getServiceName(booking.serviceId),
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

  await buildAndSend(
    "admin-booking-cancellation",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: getServiceName(booking.serviceId),
      date: booking.selectedDate,
      time: booking.selectedTime,
      totalPrice: booking.totalPrice,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
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

  await buildAndSend(
    "admin-booking-reschedule",
    {
      customerName: booking.userName,
      customerEmail: booking.userEmail,
      serviceName: getServiceName(booking.serviceId),
      oldDate,
      oldTime,
      newDate: booking.selectedDate,
      newTime: booking.selectedTime,
      totalPrice: booking.totalPrice,
      discountCode: booking.discountCode ?? undefined,
      discountAmount: booking.discountAmount || undefined,
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
