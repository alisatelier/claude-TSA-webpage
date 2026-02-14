import type {
  AccountCreatedData,
  LoyaltyWelcomeData,
  OrderConfirmationData,
  OrderShippedData,
  ServiceBookingConfirmationData,
  ServiceReminderData,
  BirthdayMonthData,
  ReferralCompletedData,
  StatusUpgradeData,
  TemplateData,
} from "./templates";

const accountCreated: AccountCreatedData = {
  firstName: "Sophia",
  referralCode: "SPIRIT-SOPHIA",
};

const loyaltyWelcome: LoyaltyWelcomeData = {
  firstName: "Sophia",
  credits: 50,
  referralCode: "SPIRIT-SOPHIA",
  tier: "Seeker",
};

const orderConfirmation: OrderConfirmationData = {
  firstName: "Sophia",
  orderNumber: "SA-20250214-001",
  items: [
    { name: "Rose Quartz Elixir", quantity: 1, price: 42.0, variation: "30ml" },
    { name: "Lunar Mist Candle", quantity: 2, price: 28.0 },
    { name: "Amethyst Ritual Kit", quantity: 1, price: 65.0, variation: "Imperfect" },
  ],
  total: 163.0,
};

const orderShipped: OrderShippedData = {
  firstName: "Sophia",
  orderNumber: "SA-20250214-001",
  trackingNumber: "1Z999AA10123456784",
};

const serviceBookingConfirmation: ServiceBookingConfirmationData = {
  firstName: "Sophia",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
  totalPrice: 120.0,
};

const serviceReminder: ServiceReminderData = {
  firstName: "Sophia",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
  preparationNote:
    "Please find a quiet, comfortable space. Have water nearby and a journal if you'd like to take notes.",
};

const birthdayMonth: BirthdayMonthData = {
  firstName: "Sophia",
  credits: 150,
};

const referralCompleted: ReferralCompletedData = {
  firstName: "Sophia",
  referredName: "Elena",
  creditsEarned: 200,
};

const statusUpgrade: StatusUpgradeData = {
  firstName: "Sophia",
  newTier: "Keeper",
  benefits: [
    "1.5x credit multiplier on all purchases",
    "Early access to new collections",
    "Free gift wrapping on every order",
    "Exclusive seasonal rituals guide",
  ],
};

export const sampleData: Record<string, TemplateData> = {
  "account-created": accountCreated,
  "loyalty-welcome": loyaltyWelcome,
  "order-confirmation": orderConfirmation,
  "order-shipped": orderShipped,
  "service-booking-confirmation": serviceBookingConfirmation,
  "service-reminder": serviceReminder,
  "birthday-month": birthdayMonth,
  "referral-completed": referralCompleted,
  "status-upgrade": statusUpgrade,
};
