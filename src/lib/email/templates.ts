import { emailLayout, fillPlaceholders } from "./layout";
import { getTrackingUrl } from "@/lib/tracking-utils";

// ── Types ──────────────────────────────────────────────────────────

export interface WishlistBackInStockData {
  firstName: string;
  productName: string;
  productImage: string;
  variation?: string;
  price: number;
  productUrl: string;
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
  image?: string;
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
  meetLink?: string;
}

export interface ServiceReminderData {
  firstName: string;
  serviceName: string;
  date: string;
  time: string;
  preparationNote?: string;
  meetLink?: string;
}

export interface BirthdayMonthData {
  firstName: string;
  credits: number;
}

export interface ReferralCompletedData {
  firstName: string;
  referredName: string;
  creditsEarned: number;
  credits: number;
}

export interface StatusUpgradeData {
  firstName: string;
  newTier: string;
  benefits: string[];
  credits: number;
  lifetimeCredits: number;
}

export interface AdminNewOrderData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  orderItems: OrderItem[];
  total: number;
}

export interface AdminNewBookingData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  totalPrice: number;
  notes?: string;
  meetLink?: string;
}

export interface AdminBookingReminderData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  meetLink?: string;
}

export interface AdminInstagramHandleData {
  customerName: string;
  customerEmail: string;
  tier: string;
  instagramHandle: string;
}

export interface BookingCancellationData {
  firstName: string;
  serviceName: string;
  date: string;
  time: string;
  totalPrice: number;
}

export interface BookingRescheduleData {
  firstName: string;
  serviceName: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  totalPrice: number;
  meetLink?: string;
}

export interface AdminBookingCancellationData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: string;
  time: string;
  totalPrice: number;
}

export interface AdminBookingRescheduleData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  oldDate: string;
  oldTime: string;
  newDate: string;
  newTime: string;
  totalPrice: number;
}

export type TemplateData =
  | WishlistBackInStockData
  | LoyaltyWelcomeData
  | OrderConfirmationData
  | OrderShippedData
  | ServiceBookingConfirmationData
  | ServiceReminderData
  | BirthdayMonthData
  | ReferralCompletedData
  | StatusUpgradeData
  | AdminNewOrderData
  | AdminNewBookingData
  | AdminBookingReminderData
  | AdminInstagramHandleData
  | BookingCancellationData
  | BookingRescheduleData
  | AdminBookingCancellationData
  | AdminBookingRescheduleData;

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
  preheader: string,
): RenderedEmail {
  const filledBody = fillPlaceholders(body, variables);
  return {
    subject: fillPlaceholders(subject, variables),
    body,
    variables,
    html: emailLayout(filledBody, {
      preheader: fillPlaceholders(preheader, variables),
    }),
  };
}

// ── Template Render Functions ──────────────────────────────────────

function buildProductCard(data: WishlistBackInStockData): string {
  const variationLine = data.variation
    ? `<p style="margin:4px 0 0;font-size:13px;color:#A69FA6;">${data.variation}</p>`
    : "";

  return `
  <div style="
    background-color:#ffffff;
    border:1px solid #535B73;
    border-radius:16px;
    padding:12px;
    margin:0 0 8px;
    text-align:center;
    max-width:360px;
  ">
    
    <!-- Product Image -->
    <img 
      src="${data.productImage}" 
      alt="${data.productName}" 
      width="200" 
      style="
        display:block;
        margin:0 auto 12px auto;
        border-radius:12px;
        height:auto;
      " 
    />

    <!-- Product Name -->
    <p style="
      margin:0 0 8px 0;
      font-size:18px;
      font-weight:600;
      color:#535B73;
    ">
      ${data.productName}
    </p>

    ${
      variationLine
        ? `
      <p style="
        margin:0 0 12px 0;
        font-size:14px;
        color:#A69FA6;
      ">
        ${variationLine}
      </p>
    `
        : ""
    }

    <!-- Price -->
    <p style="
      margin:12px 0 0 0;
      font-size:16px;
      font-weight:600;
      color:#535B73;
    ">
      ${fmt(data.price)}
    </p>

  </div>
`;
}

function renderWishlistBackInStock(
  data: WishlistBackInStockData,
): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    productName: data.productName,
    productCard: buildProductCard(data),
    productUrl: data.productUrl,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Great news — an item on your wishlist is back in stock.</p>
       {{productCard}}
       <p style="margin:0 0 16px;font-size:14px;color:#A69FA6;text-align:center;">It may not last long — claim yours before it's gone.</p>
       ${btn("View Product", "{{productUrl}}")}`;

  return render(
    body,
    variables,
    "{{productName}} Is Back in Stock",
    "{{productName}} is available again",
  );
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

  return render(
    body,
    variables,
    "Your Ritual Credits Await",
    "You have {{credits}} credits waiting",
  );
}

function buildOrderItemsTable(items: OrderItem[], total: number): string {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;width:48px;vertical-align:middle;">
            ${
              item.image
                ? `<img src="${item.image}" alt="${item.name}" width="48" height="48" style="display:block;border-radius:4px;object-fit:cover;" />`
                : `<div style="width:48px;height:48px;border-radius:4px;background-color:#F2E9E9;"></div>`
            }
          </td>
          <td style="padding:8px 0 8px 12px;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;vertical-align:middle;">
            ${item.name}${item.variation ? `<br/><span style="color:#A69FA6;font-size:12px;">${item.variation}</span>` : ""}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;text-align:center;vertical-align:middle;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #F2E9E9;color:#535B73;font-size:14px;text-align:right;vertical-align:middle;">${fmt(item.price)}</td>
        </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
         <tr style="border-bottom:2px solid #FEDDE8;">
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;width:48px;"></td>
           <td style="padding:8px 0 8px 12px;font-size:13px;color:#A69FA6;font-weight:bold;">Item</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:center;">Qty</td>
           <td style="padding:8px 0;font-size:13px;color:#A69FA6;font-weight:bold;text-align:right;">Price</td>
         </tr>
         ${rows}
         <tr>
           <td colspan="3" style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;">Total</td>
           <td style="padding:12px 0 0;font-size:15px;color:#535B73;font-weight:bold;text-align:right;">${fmt(total)}</td>
         </tr>
       </table>`;
}

function renderOrderConfirmation(data: OrderConfirmationData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    orderNumber: data.orderNumber,
    orderItems: buildOrderItemsTable(data.items, data.total),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Thank you for your order. Here's your confirmation:</p>
       <p style="margin:0 0 16px;font-size:14px;color:#A69FA6;">Order #{{orderNumber}}</p>
       {{orderItems}}
       ${btn("View Order")}`;

  return render(
    body,
    variables,
    "Order {{orderNumber}} Confirmed",
    "Order {{orderNumber}} confirmed",
  );
}

function renderOrderShipped(data: OrderShippedData): RenderedEmail {
  const trackingUrl = getTrackingUrl(data.trackingNumber);
  const variables: Record<string, string> = {
    firstName: data.firstName,
    orderNumber: data.orderNumber,
    trackingNumber: data.trackingNumber,
    trackingUrl,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your order <strong>#{{orderNumber}}</strong> is on its way.</p>
       <p style="margin:0 0 8px;font-size:14px;color:#A69FA6;">Tracking Number:</p>
       <div style="background-color:#F2E9E9;padding:16px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <a href="{{trackingUrl}}" style="font-size:16px;letter-spacing:1px;color:#535B73;font-weight:bold;text-decoration:none;">{{trackingNumber}}</a>
       </div>
       ${btn("Track Your Order", "{{trackingUrl}}")}`;

  return render(
    body,
    variables,
    "Your Order Has Shipped",
    "Order #{{orderNumber}} has shipped",
  );
}

function buildBookingCard(opts: {
  rows: string;
}): string {
  return `<div style="background-color:#ffffff;border:1px solid #535B73;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
       <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
         ${opts.rows}
       </table>
     </div>`;
}

function bookingRow(label: string, value: string, bold = false): string {
  return `<tr>
           <td style="padding:8px 0;color:#A69FA6;font-size:13px;width:100px;">${label}</td>
           <td style="padding:8px 0;color:#535B73;font-size:15px;${bold ? "font-weight:bold;" : ""}">${value}</td>
         </tr>`;
}

function renderServiceBookingConfirmation(
  data: ServiceBookingConfirmationData,
): RenderedEmail {
  const meetRow = data.meetLink
    ? bookingRow("Video Call", `<a href="${data.meetLink}" style="color:#535B73;">Join Google Meet</a>`)
    : "";

  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    totalPrice: fmt(data.totalPrice),
    meetLink: data.meetLink ?? "",
    bookingCard: buildBookingCard({
      rows:
        bookingRow("Service", data.serviceName, true) +
        bookingRow("Date", data.date) +
        bookingRow("Time", data.time) +
        meetRow +
        bookingRow("Total", fmt(data.totalPrice), true),
    }),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your booking has been confirmed. Here are the details:</p>
       {{bookingCard}}
       <p style="margin:0;color:#A69FA6;font-size:13px;">We look forward to seeing you.</p>`;

  return render(
    body,
    variables,
    "Your Booking Is Confirmed",
    "{{serviceName}} — {{date}} at {{time}}",
  );
}

function renderServiceReminder(data: ServiceReminderData): RenderedEmail {
  const meetRow = data.meetLink
    ? bookingRow("Video Call", `<a href="${data.meetLink}" style="color:#535B73;">Join Google Meet</a>`)
    : "";

  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    preparationNote: data.preparationNote ?? "",
    meetLink: data.meetLink ?? "",
    bookingCard: buildBookingCard({
      rows:
        bookingRow("Service", data.serviceName, true) +
        bookingRow("Date", data.date) +
        bookingRow("Time", data.time) +
        meetRow,
    }),
  };

  const prepBlock = `<div style="background-color:#F2E9E9;padding:16px;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0;color:#535B73;font-size:14px;"><strong>To prepare:</strong> {{preparationNote}}</p>
       </div>`;

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">This is a gentle reminder that your <strong>{{serviceName}}</strong> session is tomorrow.</p>
       {{bookingCard}}
       ${data.preparationNote ? prepBlock : ""}
       <p style="margin:0;color:#A69FA6;font-size:13px;">See you soon.</p>`;

  return render(
    body,
    variables,
    "Your Session Is Tomorrow",
    "{{serviceName}} — tomorrow at {{time}}",
  );
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

  return render(
    body,
    variables,
    "A Birthday Gift Awaits You",
    "{{credits}} birthday credits are waiting for you",
  );
}

function renderReferralCompleted(data: ReferralCompletedData): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    referredName: data.referredName,
    creditsEarned: String(data.creditsEarned),
    credits: String(data.credits),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Great news — your friend <strong>{{referredName}}</strong> just made their first purchase using your referral.</p>
       <div style="background-color:#F2E9E9;padding:24px;text-align:center;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0 0 4px;color:#A69FA6;font-size:13px;">Credits earned</p>
         <p style="margin:0;color:#535B73;font-size:28px;font-weight:bold;">+{{creditsEarned}}</p>
       </div>
       <p style="margin:0 0 16px;">Keep sharing your referral code to earn more rewards.</p>
       ${btn("View Your Credits")}`;

  return render(
    body,
    variables,
    "You Earned {{creditsEarned}} Ritual Credits",
    "+{{creditsEarned}} credits from your referral",
  );
}

function buildBenefitsBlock(
  tier: string,
  benefits: string[],
  lifetimeCredits: number,
): string {
  const nextTierLine =
    tier === "Keeper"
      ? `<p style="margin:6px 0 18px;font-size:12px;color:#A69FA6;">
           ${Math.max(0, 1500 - lifetimeCredits).toLocaleString()} credits until Elder
         </p>`
      : "";

  const benefitRows = benefits
    .map(
      (b) =>
        `<tr>
          <td style="padding:8px 0;color:#535B73;font-size:14px;line-height:1.6;">
            &#8226; ${b}
          </td>
        </tr>`,
    )
    .join("");

  return `
  <div style="
    background-color:#ffffff;
    border:1px solid #FEDDE8;
    border-radius:16px;
    padding:28px 24px;
    margin:0 auto 24px auto;
    max-width:460px;
    text-align:left;
  ">

    <!-- Tier Name -->
    <p style="
      margin:0 0 6px 0;
      font-size:20px;
      font-weight:600;
      color:#535B73;
      letter-spacing:1px;
      text-transform:uppercase;
    ">
      ${tier}
    </p>

    <!-- Lifetime Credits -->
    <p style="
      margin:0 0 ${nextTierLine ? "0" : "20px"};
      font-size:13px;
      color:#A69FA6;
    ">
      ${lifetimeCredits.toLocaleString()} Lifetime Credits Earned
    </p>

    ${nextTierLine}

    <!-- Divider -->
    <hr style="
      border:none;
      border-top:1px solid #F2E9E9;
      margin:18px 0 16px 0;
    ">

    <!-- Benefits -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      ${benefitRows}
    </table>

  </div>
  `;
}

function renderStatusUpgrade(data: StatusUpgradeData): RenderedEmail {
  const rewardsUrl = "https://www.thespiritatelier.ca/account/rewards";
  const variables: Record<string, string> = {
    firstName: data.firstName,
    newTier: data.newTier,
    credits: String(data.credits),
    lifetimeCredits: String(data.lifetimeCredits),
    benefits: buildBenefitsBlock(
      data.newTier,
      data.benefits,
      data.lifetimeCredits,
    ),
    rewardsUrl,
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Congratulations — you've been upgraded to <strong>{{newTier}}</strong> status!</p>
       {{benefits}}
       ${btn("Explore Your Rewards", "{{rewardsUrl}}")}
       <p style="margin:0;color:#A69FA6;font-size:13px;">Thank you for being part of our community.</p>`;

  return render(
    body,
    variables,
    "You've Reached {{newTier}} Status",
    "You're now a {{newTier}} member",
  );
}

function renderBookingCancellation(
  data: BookingCancellationData,
): RenderedEmail {
  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    totalPrice: fmt(data.totalPrice),
    bookingCard: buildBookingCard({
      rows:
        bookingRow("Service", data.serviceName, true) +
        bookingRow("Date", data.date) +
        bookingRow("Time", data.time) +
        bookingRow("Total", fmt(data.totalPrice), true),
    }),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your booking has been cancelled as requested. Here are the details of the cancelled session:</p>
       {{bookingCard}}
       <p style="margin:0;color:#A69FA6;font-size:13px;">If you'd like to rebook, you can do so from your account at any time.</p>`;

  return render(
    body,
    variables,
    "Your Booking Has Been Cancelled",
    "{{serviceName}} — {{date}} at {{time}} has been cancelled",
  );
}

function renderBookingReschedule(
  data: BookingRescheduleData,
): RenderedEmail {
  const meetRow = data.meetLink
    ? bookingRow("Video Call", `<a href="${data.meetLink}" style="color:#535B73;">Join Google Meet</a>`)
    : "";

  const variables: Record<string, string> = {
    firstName: data.firstName,
    serviceName: data.serviceName,
    oldDate: data.oldDate,
    oldTime: data.oldTime,
    newDate: data.newDate,
    newTime: data.newTime,
    totalPrice: fmt(data.totalPrice),
    meetLink: data.meetLink ?? "",
    bookingCard: buildBookingCard({
      rows:
        bookingRow("Service", data.serviceName, true) +
        bookingRow("New Date", data.newDate) +
        bookingRow("New Time", data.newTime) +
        meetRow +
        bookingRow("Total", fmt(data.totalPrice), true),
    }),
  };

  const body = `<p style="margin:0 0 16px;">Dear {{firstName}},</p>
       <p style="margin:0 0 16px;">Your booking has been rescheduled. Here are your updated details:</p>
       {{bookingCard}}
       <p style="margin:0 0 16px;color:#A69FA6;font-size:13px;">Previously: {{oldDate}} at {{oldTime}}</p>
       <p style="margin:0;color:#A69FA6;font-size:13px;">We look forward to seeing you.</p>`;

  return render(
    body,
    variables,
    "Your Booking Has Been Rescheduled",
    "{{serviceName}} — now {{newDate}} at {{newTime}}",
  );
}

// ── Admin Template Render Functions ────────────────────────────────

function adminInfoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#A69FA6;font-size:13px;white-space:nowrap;">${label}</td>
    <td style="padding:6px 0;color:#535B73;font-size:14px;">${value}</td>
  </tr>`;
}

function adminInfoTable(rows: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%;">${rows}</table>`;
}

function renderAdminNewOrder(data: AdminNewOrderData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    orderNumber: data.orderNumber,
    orderItems: buildOrderItemsTable(data.orderItems, data.total),
    total: fmt(data.total),
  };

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">New Order Received</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Order #", "{{orderNumber}}")
       )}
       {{orderItems}}`;

  return render(
    body,
    variables,
    "New Order #{{orderNumber}} — {{customerName}}",
    "New order from {{customerName}}",
  );
}

function renderAdminNewBooking(data: AdminNewBookingData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    totalPrice: fmt(data.totalPrice),
    notes: data.notes ?? "",
    meetLink: data.meetLink ?? "",
  };

  const meetRow = data.meetLink
    ? adminInfoRow("Video Call", `<a href="{{meetLink}}" style="color:#535B73;">Join Google Meet</a>`)
    : "";

  const notesBlock = data.notes
    ? `<div style="background-color:#F2E9E9;padding:12px;border-radius:4px;margin:0 0 16px;">
         <p style="margin:0;color:#535B73;font-size:13px;"><strong>Notes:</strong> {{notes}}</p>
       </div>`
    : "";

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">New Booking Confirmed</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Service", "{{serviceName}}") +
         adminInfoRow("Date", "{{date}}") +
         adminInfoRow("Time", "{{time}}") +
         meetRow +
         adminInfoRow("Total", "{{totalPrice}}")
       )}
       ${notesBlock}`;

  return render(
    body,
    variables,
    "New Booking — {{serviceName}} — {{customerName}}",
    "{{customerName}} booked {{serviceName}}",
  );
}

function renderAdminBookingReminder(data: AdminBookingReminderData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    meetLink: data.meetLink ?? "",
  };

  const meetRow = data.meetLink
    ? adminInfoRow("Video Call", `<a href="{{meetLink}}" style="color:#535B73;">Join Google Meet</a>`)
    : "";

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">Booking Tomorrow</p>
       <p style="margin:0 0 16px;color:#535B73;font-size:14px;">A session is scheduled for tomorrow:</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Service", "{{serviceName}}") +
         adminInfoRow("Date", "{{date}}") +
         adminInfoRow("Time", "{{time}}") +
         meetRow
       )}`;

  return render(
    body,
    variables,
    "Reminder: {{serviceName}} Tomorrow — {{customerName}}",
    "{{serviceName}} session tomorrow with {{customerName}}",
  );
}

function renderAdminInstagramHandle(data: AdminInstagramHandleData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    tier: data.tier,
    instagramHandle: data.instagramHandle,
  };

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">Instagram Handle Submitted</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Tier", "{{tier}}") +
         adminInfoRow("Instagram", "@{{instagramHandle}}")
       )}`;

  return render(
    body,
    variables,
    "Instagram Handle — {{customerName}} (@{{instagramHandle}})",
    "{{customerName}} submitted @{{instagramHandle}}",
  );
}

function renderAdminBookingCancellation(data: AdminBookingCancellationData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    totalPrice: fmt(data.totalPrice),
  };

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">Booking Cancelled</p>
       <p style="margin:0 0 16px;color:#535B73;font-size:14px;">A customer has cancelled their booking:</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Service", "{{serviceName}}") +
         adminInfoRow("Date", "{{date}}") +
         adminInfoRow("Time", "{{time}}") +
         adminInfoRow("Total", "{{totalPrice}}")
       )}`;

  return render(
    body,
    variables,
    "Booking Cancelled — {{serviceName}} — {{customerName}}",
    "{{customerName}} cancelled {{serviceName}}",
  );
}

function renderAdminBookingReschedule(data: AdminBookingRescheduleData): RenderedEmail {
  const variables: Record<string, string> = {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    serviceName: data.serviceName,
    oldDate: data.oldDate,
    oldTime: data.oldTime,
    newDate: data.newDate,
    newTime: data.newTime,
    totalPrice: fmt(data.totalPrice),
  };

  const body = `<p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#535B73;">Booking Rescheduled</p>
       <p style="margin:0 0 16px;color:#535B73;font-size:14px;">A customer has rescheduled their booking:</p>
       ${adminInfoTable(
         adminInfoRow("Customer", "{{customerName}}") +
         adminInfoRow("Email", "{{customerEmail}}") +
         adminInfoRow("Service", "{{serviceName}}") +
         adminInfoRow("Old Date", "{{oldDate}}") +
         adminInfoRow("Old Time", "{{oldTime}}") +
         adminInfoRow("New Date", "{{newDate}}") +
         adminInfoRow("New Time", "{{newTime}}") +
         adminInfoRow("Total", "{{totalPrice}}")
       )}`;

  return render(
    body,
    variables,
    "Booking Rescheduled — {{serviceName}} — {{customerName}}",
    "{{customerName}} rescheduled {{serviceName}}",
  );
}

// ── Template Registry ──────────────────────────────────────────────

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  trigger: string;
  audience?: "admin";
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "loyalty-welcome",
    name: "Loyalty Welcome",
    description:
      "Welcome bonus and referral code for the Ritual Rewards programme.",
    trigger: "First loyalty enrolment",
  },
  {
    id: "wishlist-back-in-stock",
    name: "Wishlist Back in Stock",
    description: "Notification when a wishlisted item is restocked.",
    trigger: "Stock replenished for wishlisted product",
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
    description:
      "Birthday credits gift at the start of the customer's birth month.",
    trigger: "Start of birthday month",
  },
  {
    id: "referral-completed",
    name: "Referral Completed",
    description:
      "Notification that a referred friend made their first purchase.",
    trigger: "Referred user completes first order",
  },
  {
    id: "status-upgrade",
    name: "Status Upgrade",
    description:
      "Congratulations email when a customer reaches a new loyalty tier.",
    trigger: "Tier threshold reached",
  },
  {
    id: "booking-cancellation",
    name: "Booking Cancellation",
    description: "Confirmation sent when a customer cancels a booking.",
    trigger: "Booking cancelled by customer",
  },
  {
    id: "booking-reschedule",
    name: "Booking Reschedule",
    description: "Confirmation sent when a customer reschedules a booking.",
    trigger: "Booking rescheduled by customer",
  },
  {
    id: "admin-new-order",
    name: "Admin: New Order",
    description: "Notification sent to admin when a customer places an order.",
    trigger: "Order placed",
    audience: "admin",
  },
  {
    id: "admin-new-booking",
    name: "Admin: New Booking",
    description: "Notification sent to admin when a booking is confirmed.",
    trigger: "Booking confirmed",
    audience: "admin",
  },
  {
    id: "admin-booking-reminder",
    name: "Admin: Booking Reminder",
    description: "Reminder sent to admin the day before a booked session.",
    trigger: "24 hours before booking",
    audience: "admin",
  },
  {
    id: "admin-instagram-handle",
    name: "Admin: Instagram Handle",
    description: "Notification when a customer submits their Instagram handle.",
    trigger: "Instagram handle submitted",
    audience: "admin",
  },
  {
    id: "admin-booking-cancellation",
    name: "Admin: Booking Cancellation",
    description: "Notification sent to admin when a customer cancels a booking.",
    trigger: "Booking cancelled by customer",
    audience: "admin",
  },
  {
    id: "admin-booking-reschedule",
    name: "Admin: Booking Reschedule",
    description: "Notification sent to admin when a customer reschedules a booking.",
    trigger: "Booking rescheduled by customer",
    audience: "admin",
  },
];

// ── Default Subjects ───────────────────────────────────────────────

export const DEFAULT_SUBJECTS: Record<string, string> = {
  "wishlist-back-in-stock": "{{productName}} Is Back in Stock",
  "loyalty-welcome": "Your Ritual Credits Await",
  "order-confirmation": "Order {{orderNumber}} Confirmed",
  "order-shipped": "Your Order Has Shipped",
  "service-booking-confirmation": "Your Booking Is Confirmed",
  "service-reminder": "Your Session Is Tomorrow",
  "birthday-month": "A Birthday Gift Awaits You",
  "referral-completed": "You Earned {{creditsEarned}} Ritual Credits",
  "status-upgrade": "You've Reached {{newTier}} Status",
  "admin-new-order": "New Order #{{orderNumber}} — {{customerName}}",
  "admin-new-booking": "New Booking — {{serviceName}} — {{customerName}}",
  "admin-booking-reminder": "Reminder: {{serviceName}} Tomorrow — {{customerName}}",
  "admin-instagram-handle": "Instagram Handle — {{customerName}} (@{{instagramHandle}})",
  "booking-cancellation": "Your Booking Has Been Cancelled",
  "booking-reschedule": "Your Booking Has Been Rescheduled",
  "admin-booking-cancellation": "Booking Cancelled — {{serviceName}} — {{customerName}}",
  "admin-booking-reschedule": "Booking Rescheduled — {{serviceName}} — {{customerName}}",
};

// ── Dispatcher ─────────────────────────────────────────────────────

const renderers: Record<string, (data: never) => RenderedEmail> = {
  "wishlist-back-in-stock": renderWishlistBackInStock as (
    data: never,
  ) => RenderedEmail,
  "loyalty-welcome": renderLoyaltyWelcome as (data: never) => RenderedEmail,
  "order-confirmation": renderOrderConfirmation as (
    data: never,
  ) => RenderedEmail,
  "order-shipped": renderOrderShipped as (data: never) => RenderedEmail,
  "service-booking-confirmation": renderServiceBookingConfirmation as (
    data: never,
  ) => RenderedEmail,
  "service-reminder": renderServiceReminder as (data: never) => RenderedEmail,
  "birthday-month": renderBirthdayMonth as (data: never) => RenderedEmail,
  "referral-completed": renderReferralCompleted as (
    data: never,
  ) => RenderedEmail,
  "status-upgrade": renderStatusUpgrade as (data: never) => RenderedEmail,
  "admin-new-order": renderAdminNewOrder as (data: never) => RenderedEmail,
  "admin-new-booking": renderAdminNewBooking as (data: never) => RenderedEmail,
  "admin-booking-reminder": renderAdminBookingReminder as (
    data: never,
  ) => RenderedEmail,
  "admin-instagram-handle": renderAdminInstagramHandle as (
    data: never,
  ) => RenderedEmail,
  "booking-cancellation": renderBookingCancellation as (
    data: never,
  ) => RenderedEmail,
  "booking-reschedule": renderBookingReschedule as (
    data: never,
  ) => RenderedEmail,
  "admin-booking-cancellation": renderAdminBookingCancellation as (
    data: never,
  ) => RenderedEmail,
  "admin-booking-reschedule": renderAdminBookingReschedule as (
    data: never,
  ) => RenderedEmail,
};

export function renderTemplate(
  templateId: string,
  data: TemplateData,
): RenderedEmail {
  const renderer = renderers[templateId];
  if (!renderer) throw new Error(`Unknown template: ${templateId}`);
  return renderer(data as never);
}
