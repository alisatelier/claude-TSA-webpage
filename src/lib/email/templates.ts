import { emailLayout } from "./layout";

// ── Types ──────────────────────────────────────────────────────────

export interface AccountCreatedData {
  firstName: string;
}

export interface LoyaltyWelcomeData {
  firstName: string;
  credits: number;
  referralCode: string;
  tier: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variation?: string;
}

export interface OrderConfirmationData {
  firstName: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
}

export interface OrderShippedData {
  firstName: string;
  orderNumber: string;
  trackingNumber: string;
}

export interface ServiceBookingConfirmationData {
  firstName: string;
  serviceName: string;
  date: string;
  time: string;
  totalPrice: number;
}

export interface ServiceReminderData {
  firstName: string;
  serviceName: string;
  date: string;
  time: string;
  preparationNote?: string;
}

export interface BirthdayMonthData {
  firstName: string;
  credits: number;
}

export interface ReferralCompletedData {
  firstName: string;
  referredName: string;
  creditsEarned: number;
}

export interface StatusUpgradeData {
  firstName: string;
  newTier: string;
  benefits: string[];
}

export type TemplateData =
  | AccountCreatedData
  | LoyaltyWelcomeData
  | OrderConfirmationData
  | OrderShippedData
  | ServiceBookingConfirmationData
  | ServiceReminderData
  | BirthdayMonthData
  | ReferralCompletedData
  | StatusUpgradeData;

// ── Helpers ────────────────────────────────────────────────────────

function btn(text: string, href = "#"): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td align="center" style="background-color:#535B73;border-radius:4px;">
        <a href="${href}" style="display:inline-block;padding:12px 28px;color:#FFFFFF;font-family:Georgia,serif;font-size:14px;text-decoration:none;letter-spacing:1px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

function fmt(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// ── Template Render Functions ──────────────────────────────────────

function renderAccountCreated(data: AccountCreatedData) {
  return {
    subject: "Welcome to The Spirit Atelier",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Welcome to The Spirit Atelier. Your account has been created successfully.</p>
       <p style="margin:0 0 16px;">You now have access to order tracking, saved favourites, and our loyalty programme.</p>
       ${btn("Visit Your Account")}
       <p style="margin:0;color:#A69FA6;font-size:13px;">We're so glad you're here.</p>`,
      { preheader: "Your account is ready" }
    ),
  };
}

function renderLoyaltyWelcome(data: LoyaltyWelcomeData) {
  return {
    subject: "Your Ritual Credits Await",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Welcome to our Ritual Rewards programme. You've been gifted <strong>${data.credits} credits</strong> as a welcome bonus.</p>
       <p style="margin:0 0 16px;">Your current tier: <strong>${data.tier}</strong></p>
       <p style="margin:0 0 16px;">Share your referral code with friends and earn even more credits:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <span style="font-size:18px;letter-spacing:2px;color:#535B73;font-weight:bold;">${data.referralCode}</span>
       </div>
       ${btn("Explore Rewards")}`,
      { preheader: `You have ${data.credits} credits waiting` }
    ),
  };
}

function renderOrderConfirmation(data: OrderConfirmationData) {
  const rows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;">
            ${item.name}${item.variation ? ` <span style="color:#A69FA6;">— ${item.variation}</span>` : ""}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;text-align:right;">${fmt(item.price)}</td>
        </tr>`
    )
    .join("");

  return {
    subject: `Order ${data.orderNumber} Confirmed`,
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Thank you for your order. Here's your confirmation:</p>
       <p style="margin:0 0 16px;font-size:14px;color:#A69FA6;">Order #${data.orderNumber}</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
         <tr style="border-bottom:2px solid #FEDDE8;">
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;">Item</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:center;">Qty</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:right;">Price</td>
         </tr>
         ${rows}
         <tr>
           <td colspan="2" style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;">Total</td>
           <td style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;text-align:right;">${fmt(data.total)}</td>
         </tr>
       </table>
       ${btn("View Order")}`,
      { preheader: `Order ${data.orderNumber} confirmed` }
    ),
  };
}

function renderOrderShipped(data: OrderShippedData) {
  return {
    subject: "Your Order Has Shipped",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Your order <strong>#${data.orderNumber}</strong> is on its way.</p>
       <p style="margin:0 0 8px;font-size:14px;color:#A69FA6;">Tracking Number:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <span style="font-size:16px;letter-spacing:1px;color:#535B73;font-weight:bold;">${data.trackingNumber}</span>
       </div>
       ${btn("Track Your Order")}`,
      { preheader: `Order #${data.orderNumber} has shipped` }
    ),
  };
}

function renderServiceBookingConfirmation(data: ServiceBookingConfirmationData) {
  return {
    subject: "Your Booking Is Confirmed",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Your booking has been confirmed. Here are the details:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;width:100px;">Service</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;font-weight:bold;">${data.serviceName}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Date</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">${data.date}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Time</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">${data.time}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Total</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;font-weight:bold;">${fmt(data.totalPrice)}</td>
         </tr>
       </table>
       <p style="margin:0;color:#A69FA6;font-size:13px;">We look forward to seeing you.</p>`,
      { preheader: `${data.serviceName} — ${data.date} at ${data.time}` }
    ),
  };
}

function renderServiceReminder(data: ServiceReminderData) {
  const prepNote = data.preparationNote
    ? `<div style="background-color:#F2E9E9;padding:16px;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0;color:#535B73;font-size:14px;"><strong>To prepare:</strong> ${data.preparationNote}</p>
       </div>`
    : "";

  return {
    subject: "Your Session Is Tomorrow",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">This is a gentle reminder that your <strong>${data.serviceName}</strong> session is tomorrow.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;width:100px;">Date</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">${data.date}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Time</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">${data.time}</td>
         </tr>
       </table>
       ${prepNote}
       <p style="margin:0;color:#A69FA6;font-size:13px;">See you soon.</p>`,
      { preheader: `${data.serviceName} — tomorrow at ${data.time}` }
    ),
  };
}

function renderBirthdayMonth(data: BirthdayMonthData) {
  return {
    subject: "A Birthday Gift Awaits You",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Happy birthday month! We'd love to celebrate with you.</p>
       <div style="background-color:#F2E9E9;padding:24px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0 0 4px;color:#A69FA6;font-size:13px;">Your birthday gift</p>
         <p style="margin:0;color:#535B73;font-size:28px;font-weight:bold;">${data.credits} Credits</p>
       </div>
       <p style="margin:0 0 16px;">Use them on anything in the shop or toward a service booking this month.</p>
       ${btn("Claim Your Gift")}`,
      { preheader: `${data.credits} birthday credits are waiting for you` }
    ),
  };
}

function renderReferralCompleted(data: ReferralCompletedData) {
  return {
    subject: "You Earned 200 Ritual Credits",
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Great news — your friend <strong>${data.referredName}</strong> just made their first purchase using your referral.</p>
       <div style="background-color:#F2E9E9;padding:24px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0 0 4px;color:#A69FA6;font-size:13px;">Credits earned</p>
         <p style="margin:0;color:#535B73;font-size:28px;font-weight:bold;">+${data.creditsEarned}</p>
       </div>
       <p style="margin:0 0 16px;">Keep sharing your referral code to earn more rewards.</p>
       ${btn("View Your Credits")}`,
      { preheader: `+${data.creditsEarned} credits from your referral` }
    ),
  };
}

function renderStatusUpgrade(data: StatusUpgradeData) {
  const benefitsList = data.benefits
    .map(
      (b) =>
        `<tr>
          <td style="padding:6px 0 6px 16px;color:#535B73;font-size:14px;">&#8226; ${b}</td>
        </tr>`
    )
    .join("");

  return {
    subject: `You've Reached ${data.newTier} Status`,
    html: emailLayout(
      `<p style="margin:0 0 16px;">Dear ${data.firstName},</p>
       <p style="margin:0 0 16px;">Congratulations — you've been upgraded to <strong>${data.newTier}</strong> status!</p>
       <p style="margin:0 0 8px;color:#A69FA6;font-size:13px;">Your new benefits:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         ${benefitsList}
       </table>
       ${btn("Explore Your Rewards")}
       <p style="margin:0;color:#A69FA6;font-size:13px;">Thank you for being part of our community.</p>`,
      { preheader: `You're now a ${data.newTier} member` }
    ),
  };
}

// ── Template Registry ──────────────────────────────────────────────

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  trigger: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "account-created",
    name: "Account Created",
    description: "Welcome email sent when a new account is created.",
    trigger: "User signs up",
  },
  {
    id: "loyalty-welcome",
    name: "Loyalty Welcome",
    description: "Welcome bonus and referral code for the Ritual Rewards programme.",
    trigger: "First loyalty enrolment",
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    description: "Itemised confirmation sent after a successful order.",
    trigger: "Order placed",
  },
  {
    id: "order-shipped",
    name: "Order Shipped",
    description: "Shipping notification with tracking number.",
    trigger: "Order marked as shipped",
  },
  {
    id: "service-booking-confirmation",
    name: "Service Booking Confirmation",
    description: "Confirmation with service details, date, and time.",
    trigger: "Booking created",
  },
  {
    id: "service-reminder",
    name: "Service Reminder",
    description: "Reminder sent the day before a booked session.",
    trigger: "24 hours before booking",
  },
  {
    id: "birthday-month",
    name: "Birthday Month",
    description: "Birthday credits gift at the start of the customer's birth month.",
    trigger: "Start of birthday month",
  },
  {
    id: "referral-completed",
    name: "Referral Completed",
    description: "Notification that a referred friend made their first purchase.",
    trigger: "Referred user completes first order",
  },
  {
    id: "status-upgrade",
    name: "Status Upgrade",
    description: "Congratulations email when a customer reaches a new loyalty tier.",
    trigger: "Tier threshold reached",
  },
];

// ── Dispatcher ─────────────────────────────────────────────────────

const renderers: Record<string, (data: never) => { subject: string; html: string }> = {
  "account-created": renderAccountCreated as (data: never) => { subject: string; html: string },
  "loyalty-welcome": renderLoyaltyWelcome as (data: never) => { subject: string; html: string },
  "order-confirmation": renderOrderConfirmation as (data: never) => { subject: string; html: string },
  "order-shipped": renderOrderShipped as (data: never) => { subject: string; html: string },
  "service-booking-confirmation": renderServiceBookingConfirmation as (data: never) => { subject: string; html: string },
  "service-reminder": renderServiceReminder as (data: never) => { subject: string; html: string },
  "birthday-month": renderBirthdayMonth as (data: never) => { subject: string; html: string },
  "referral-completed": renderReferralCompleted as (data: never) => { subject: string; html: string },
  "status-upgrade": renderStatusUpgrade as (data: never) => { subject: string; html: string },
};

export function renderTemplate(
  templateId: string,
  data: TemplateData
): { subject: string; html: string } {
  const renderer = renderers[templateId];
  if (!renderer) throw new Error(`Unknown template: ${templateId}`);
  return renderer(data as never);
}
