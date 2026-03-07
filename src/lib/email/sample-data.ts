import type {
  WishlistBackInStockData,
  LoyaltyWelcomeData,
  OrderConfirmationData,
  OrderShippedData,
  ServiceBookingConfirmationData,
  ServiceReminderData,
  BirthdayMonthData,
  ReferralCompletedData,
  StatusUpgradeData,
  AdminNewOrderData,
  AdminNewBookingData,
  AdminBookingReminderData,
  AdminInstagramHandleData,
  AdminNewReviewData,
  BookingCancellationData,
  BookingRescheduleData,
  AdminBookingCancellationData,
  AdminBookingRescheduleData,
  TemplateData,
} from "./templates";
import { resolveProduct } from "@/lib/order-utils";

const wishlistBackInStock: WishlistBackInStockData = {
  firstName: "Sophia",
  productName: "Norse Runes",
  productImage: resolveProduct("norse-runes", "Black | Gold").image,
  variation: "Black | Gold",
  price: 55,
  productUrl: "/shop/norse-runes",
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
    { name: "Whims & Whispers Journal", quantity: 1, price: 33.0, variation: "Grey", image: resolveProduct("whims-whispers-journal", "Grey").image },
    { name: "Norse Runes", quantity: 1, price: 55.0, variation: "Black | Gold", image: resolveProduct("norse-runes", "Black | Gold").image },
    { name: "Whims & Whispers Tarot Deck", quantity: 1, price: 44.0, variation: "Pink", image: resolveProduct("whims-whispers-tarot", "Pink").image },
  ],
  total: 132.0,
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
  credits: 450,
};

const statusUpgrade: StatusUpgradeData = {
  firstName: "Sophia",
  newTier: "Keeper",
  benefits: [
    "24-Hour Early Access to Limited Drops",
    "Recognition in a Dedicated Instagram Story",
  ],
  credits: 500,
  lifetimeCredits: 750,
};

const adminNewOrder: AdminNewOrderData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  orderNumber: "SA-20250214-001",
  orderItems: [
    { name: "Whims & Whispers Journal", quantity: 1, price: 33.0, variation: "Grey", image: resolveProduct("whims-whispers-journal", "Grey").image },
    { name: "Norse Runes", quantity: 1, price: 55.0, variation: "Black | Gold", image: resolveProduct("norse-runes", "Black | Gold").image },
  ],
  total: 88.0,
};

const adminNewBooking: AdminNewBookingData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
  totalPrice: 120.0,
};

const adminBookingReminder: AdminBookingReminderData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
};

const adminInstagramHandle: AdminInstagramHandleData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  tier: "Keeper",
  instagramHandle: "sophia.spirit",
};

const adminNewReview: AdminNewReviewData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  productName: "Whims & Whispers Tarot Deck",
  productId: "whims-whispers-tarot",
  rating: 5,
  reviewText: "Absolutely stunning deck! The artwork is breathtaking and the guidebook is incredibly detailed. Each card feels like a piece of art. I use it daily for my morning readings and it has quickly become my favourite deck in my collection.",
};

const bookingCancellation: BookingCancellationData = {
  firstName: "Sophia",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
  totalPrice: 120.0,
};

const bookingReschedule: BookingRescheduleData = {
  firstName: "Sophia",
  serviceName: "Intuitive Energy Reading",
  oldDate: "Saturday, 15 March 2025",
  oldTime: "2:00 PM",
  newDate: "Tuesday, 18 March 2025",
  newTime: "4:00 PM",
  totalPrice: 120.0,
};

const adminBookingCancellation: AdminBookingCancellationData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  serviceName: "Intuitive Energy Reading",
  date: "Saturday, 15 March 2025",
  time: "2:00 PM",
  totalPrice: 120.0,
};

const adminBookingReschedule: AdminBookingRescheduleData = {
  customerName: "Sophia",
  customerEmail: "sophia@test.com",
  serviceName: "Intuitive Energy Reading",
  oldDate: "Saturday, 15 March 2025",
  oldTime: "2:00 PM",
  newDate: "Tuesday, 18 March 2025",
  newTime: "4:00 PM",
  totalPrice: 120.0,
};

export const sampleData: Record<string, TemplateData> = {
  "wishlist-back-in-stock": wishlistBackInStock,
  "loyalty-welcome": loyaltyWelcome,
  "order-confirmation": orderConfirmation,
  "order-shipped": orderShipped,
  "service-booking-confirmation": serviceBookingConfirmation,
  "service-reminder": serviceReminder,
  "birthday-month": birthdayMonth,
  "referral-completed": referralCompleted,
  "status-upgrade": statusUpgrade,
  "admin-new-order": adminNewOrder,
  "admin-new-booking": adminNewBooking,
  "admin-booking-reminder": adminBookingReminder,
  "admin-instagram-handle": adminInstagramHandle,
  "admin-new-review": adminNewReview,
  "booking-cancellation": bookingCancellation,
  "booking-reschedule": bookingReschedule,
  "admin-booking-cancellation": adminBookingCancellation,
  "admin-booking-reschedule": adminBookingReschedule,
};
