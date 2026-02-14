import { emailLayout, fillPlaceholders } from "./layout";

// ── Types ──────────────────────────────────────────────────────────

export interface AccountCreatedData {
  firstName: string;
  referralCode: string;
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

export interface RenderedEmail {
  subject: string;
  html: string;
  body: string;
  variables: Record<string, string>;
}

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

function render(
  body: string,
  variables: Record<string, string>,
  subject: string,
  preheader: string
): RenderedEmail {
  const filledBody = fillPlaceholders(body, variables);
  return {
    subject: fillPlaceholders(subject, variables),
    body,
    variables,
    html: emailLayout(filledBody, { preheader: fillPlaceholders(preheader, variables) }),
  };
}

// ── Template Render Functions ──────────────────────────────────────

function renderAccountCreated(data: AccountCreatedData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    referralCode: data.referralCode,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Welcome to The Spirit Atelier. Your account has been created successfully.</p>
       <p style="margin:0 0 16px;">You now have access to order tracking, saved favourites, and our loyalty programme.</p>
       <p style="margin:0 0 16px;">Your personal referral code:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <span style="font-size:18px;letter-spacing:2px;color:#535B73;font-weight:bold;">{{referralCode}}</span>
       </div>
       ${btn("Visit Your Account")}
       <p style="margin:0;color:#A69FA6;font-size:13px;">We're so glad you're here.</p>`;

  return render(body, variables, "Welcome to The Spirit Atelier", "Your account is ready");
}

function renderLoyaltyWelcome(data: LoyaltyWelcomeData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    credits: String(data.credits),
    referralCode: data.referralCode,
    tier: data.tier,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Welcome to our Ritual Rewards programme. You've been gifted <strong>{{credits}} credits</strong> as a welcome bonus.</p>
       <p style="margin:0 0 16px;">Your current tier: <strong>{{tier}}</strong></p>
       <p style="margin:0 0 16px;">Share your referral code with friends and earn even more credits:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <span style="font-size:18px;letter-spacing:2px;color:#535B73;font-weight:bold;">{{referralCode}}</span>
       </div>
       ${btn("Explore Rewards")}`;

  return render(body, variables, "Your Ritual Credits Await", "You have {{credits}} credits waiting");
}

function renderOrderConfirmation(data: OrderConfirmationData): RenderedEmail {
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

  const variables: Record<string, string> = {
    firstName: data.firstName,
    orderNumber: data.orderNumber,
    total: fmt(data.total),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Thank you for your order. Here's your confirmation:</p>
       <p style="margin:0 0 16px;font-size:14px;color:#A69FA6;">Order #{{orderNumber}}</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
         <tr style="border-bottom:2px solid #FEDDE8;">
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;">Item</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:center;">Qty</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:right;">Price</td>
         </tr>
         ${rows}
         <tr>
           <td colspan="2" style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;">Total</td>
           <td style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;text-align:right;">{{total}}</td>
         </tr>
       </table>
       ${btn("View Order")}`;

  return render(body, variables, "Order {{orderNumber}} Confirmed", "Order {{orderNumber}} confirmed");
}

function renderOrderShipped(data: OrderShippedData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    orderNumber: data.orderNumber,
    trackingNumber: data.trackingNumber,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your order <strong>#{{orderNumber}}</strong> is on its way.</p>
       <p style="margin:0 0 8px;font-size:14px;color:#A69FA6;">Tracking Number:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <span style="font-size:16px;letter-spacing:1px;color:#535B73;font-weight:bold;">{{trackingNumber}}</span>
       </div>
       ${btn("Track Your Order")}`;

  return render(body, variables, "Your Order Has Shipped", "Order #{{orderNumber}} has shipped");
}

function renderServiceBookingConfirmation(data: ServiceBookingConfirmationData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    totalPrice: fmt(data.totalPrice),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your booking has been confirmed. Here are the details:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;width:100px;">Service</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;font-weight:bold;">{{serviceName}}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Date</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">{{date}}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Time</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">{{time}}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Total</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;font-weight:bold;">{{totalPrice}}</td>
         </tr>
       </table>
       <p style="margin:0;color:#A69FA6;font-size:13px;">We look forward to seeing you.</p>`;

  return render(body, variables, "Your Booking Is Confirmed", "{{serviceName}} — {{date}} at {{time}}");
}

function renderServiceReminder(data: ServiceReminderData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    preparationNote: data.preparationNote ?? "",
  };

  const prepBlock = `<div style="background-color:#F2E9E9;padding:16px;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0;color:#535B73;font-size:14px;"><strong>To prepare:</strong> {{preparationNote}}</p>
       </div>`;

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">This is a gentle reminder that your <strong>{{serviceName}}</strong> session is tomorrow.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;width:100px;">Date</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">{{date}}</td>
         </tr>
         <tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;">Time</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;">{{time}}</td>
         </tr>
       </table>
       ${data.preparationNote ? prepBlock : ""}
       <p style="margin:0;color:#A69FA6;font-size:13px;">See you soon.</p>`;

  return render(body, variables, "Your Session Is Tomorrow", "{{serviceName}} — tomorrow at {{time}}");
}

function renderBirthdayMonth(data: BirthdayMonthData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    credits: String(data.credits),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Happy birthday month! We'd love to celebrate with you.</p>
       <div style="background-color:#F2E9E9;padding:24px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0 0 4px;color:#A69FA6;font-size:13px;">Your birthday gift</p>
         <p style="margin:0;color:#535B73;font-size:28px;font-weight:bold;">{{credits}} Credits</p>
       </div>
       <p style="margin:0 0 16px;">Use them on anything in the shop or toward a service booking this month.</p>
       ${btn("Claim Your Gift")}`;

  return render(body, variables, "A Birthday Gift Awaits You", "{{credits}} birthday credits are waiting for you");
}

function renderReferralCompleted(data: ReferralCompletedData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    referredName: data.referredName,
    creditsEarned: String(data.creditsEarned),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Great news — your friend <strong>{{referredName}}</strong> just made their first purchase using your referral.</p>
       <div style="background-color:#F2E9E9;padding:24px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0 0 4px;color:#A69FA6;font-size:13px;">Credits earned</p>
         <p style="margin:0;color:#535B73;font-size:28px;font-weight:bold;">+{{creditsEarned}}</p>
       </div>
       <p style="margin:0 0 16px;">Keep sharing your referral code to earn more rewards.</p>
       ${btn("View Your Credits")}`;

  return render(body, variables, "You Earned {{creditsEarned}} Ritual Credits", "+{{creditsEarned}} credits from your referral");
}

function renderStatusUpgrade(data: StatusUpgradeData): RenderedEmail {
  const benefitsList = data.benefits
    .map(
      (b) =>
        `<tr>
          <td style="padding:6px 0 6px 16px;color:#535B73;font-size:14px;">&#8226; ${b}</td>
        </tr>`
    )
    .join("");

  const variables: Record<string, string> = {
    firstName: data.firstName,
    newTier: data.newTier,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Congratulations — you've been upgraded to <strong>{{newTier}}</strong> status!</p>
       <p style="margin:0 0 8px;color:#A69FA6;font-size:13px;">Your new benefits:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
         ${benefitsList}
       </table>
       ${btn("Explore Your Rewards")}
       <p style="margin:0;color:#A69FA6;font-size:13px;">Thank you for being part of our community.</p>`;

  return render(body, variables, "You've Reached {{newTier}} Status", "You're now a {{newTier}} member");
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

// ── Default Subjects ───────────────────────────────────────────────

export const DEFAULT_SUBJECTS: Record<string, string> = {
  "account-created": "Welcome to The Spirit Atelier",
  "loyalty-welcome": "Your Ritual Credits Await",
  "order-confirmation": "Order {{orderNumber}} Confirmed",
  "order-shipped": "Your Order Has Shipped",
  "service-booking-confirmation": "Your Booking Is Confirmed",
  "service-reminder": "Your Session Is Tomorrow",
  "birthday-month": "A Birthday Gift Awaits You",
  "referral-completed": "You Earned {{creditsEarned}} Ritual Credits",
  "status-upgrade": "You've Reached {{newTier}} Status",
};

// ── Dispatcher ─────────────────────────────────────────────────────

const renderers: Record<string, (data: never) => RenderedEmail> = {
  "account-created": renderAccountCreated as (data: never) => RenderedEmail,
  "loyalty-welcome": renderLoyaltyWelcome as (data: never) => RenderedEmail,
  "order-confirmation": renderOrderConfirmation as (data: never) => RenderedEmail,
  "order-shipped": renderOrderShipped as (data: never) => RenderedEmail,
  "service-booking-confirmation": renderServiceBookingConfirmation as (data: never) => RenderedEmail,
  "service-reminder": renderServiceReminder as (data: never) => RenderedEmail,
  "birthday-month": renderBirthdayMonth as (data: never) => RenderedEmail,
  "referral-completed": renderReferralCompleted as (data: never) => RenderedEmail,
  "status-upgrade": renderStatusUpgrade as (data: never) => RenderedEmail,
};

export function renderTemplate(
  templateId: string,
  data: TemplateData
): RenderedEmail {
  const renderer = renderers[templateId];
  if (!renderer) throw new Error(`Unknown template: ${templateId}`);
  return renderer(data as never);
}
