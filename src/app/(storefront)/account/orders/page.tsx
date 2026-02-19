"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { formatOrderNumber } from "@/lib/order-utils";
import { detectCarrier, getTrackingUrl } from "@/lib/tracking-utils";
import { isWithin24Hours } from "@/lib/booking-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faChevronDown,
  faTruck,
  faArrowUpRightFromSquare,
  faCalendarCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { services } from "@/lib/data";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  variation: string | null;
  image: string;
}

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  totalAmount: number;
  trackingNumber: string | null;
  refundAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface Booking {
  id: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  status: string;
  userName: string;
  userNotes: string;
  addOn: boolean;
  totalPrice: number;
  googleMeetLink: string | null;
  createdAt: string;
}

const BOOKING_STATUS_STYLES: Record<string, string> = {
  HELD: "bg-blush/20 text-navy",
  CONFIRMED: "bg-navy/10 text-navy",
  COMPLETED: "bg-teal-100 text-teal-800",
  CANCELLED: "bg-mauve/20 text-mauve",
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  HELD: "Held",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-blush/20 text-navy",
  SHIPPED: "bg-navy/10 text-navy",
  COMPLETED: "bg-teal-100 text-teal-800",
  CANCELLED: "bg-mauve/20 text-mauve",
};

const STATUS_LABELS: Record<string, string> = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const TIME_SLOTS = ["12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const [dateMin, setDateMin] = useState("");
  const [dateMax, setDateMax] = useState("");

  // Cancel dialog state
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule modal state
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [slotStatuses, setSlotStatuses] = useState<Record<string, "available" | "blocked" | "booked" | "loading">>({});

  useEffect(() => {
    fetch("/api/schedule/settings")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!data) return;
        const today = new Date();
        const min = new Date(today);
        min.setDate(min.getDate() + data.leadTimeDays);
        const max = new Date(today);
        max.setDate(max.getDate() + data.maxRangeDays);
        setDateMin(min.toISOString().split("T")[0]);
        setDateMax(max.toISOString().split("T")[0]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    let remaining = 2;
    const done = () => { remaining--; if (remaining === 0) setLoading(false); };
    fetch("/api/user/orders")
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(done);
    fetch("/api/user/bookings")
      .then((res) => (res.ok ? res.json() : { bookings: [] }))
      .then((data) => setBookings(data.bookings ?? []))
      .catch(() => setBookings([]))
      .finally(done);
  }, [isLoggedIn]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  // Cancel handler
  const handleCancel = async () => {
    if (!cancelBookingId) return;
    setCancelLoading(true);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: cancelBookingId }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === cancelBookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
      }
    } finally {
      setCancelLoading(false);
      setCancelBookingId(null);
    }
  };

  // Check slot availability when reschedule date changes
  const checkSlots = useCallback(
    async (date: string) => {
      if (!date || !rescheduleBooking) return;

      // Reset slots to loading
      const initial: Record<string, "loading"> = {};
      for (const slot of TIME_SLOTS) initial[slot] = "loading";
      setSlotStatuses(initial);
      setRescheduleTime("");

      try {
        // Fetch schedule blocks
        const availRes = await fetch(`/api/schedule/availability?date=${date}`);
        const availData = await availRes.json();
        const blockedSlots = new Set<string>(availData.blockedSlots ?? []);

        const newStatuses: Record<string, "available" | "blocked" | "booked" | "loading"> = {};

        // Check each non-blocked slot for booking conflicts
        await Promise.all(
          TIME_SLOTS.map(async (slot) => {
            if (blockedSlots.has(slot)) {
              newStatuses[slot] = "blocked";
              return;
            }

            // If same date as current booking, own slot is always available
            if (
              date === rescheduleBooking.selectedDate &&
              slot === rescheduleBooking.selectedTime
            ) {
              newStatuses[slot] = "available";
              return;
            }

            const checkRes = await fetch(
              `/api/bookings/check?serviceId=${rescheduleBooking.serviceId}&date=${date}&time=${encodeURIComponent(slot)}`
            );
            const checkData = await checkRes.json();
            newStatuses[slot] = checkData.taken ? "booked" : "available";
          })
        );

        setSlotStatuses(newStatuses);
      } catch {
        // On error, mark all as blocked
        const errStatuses: Record<string, "blocked"> = {};
        for (const slot of TIME_SLOTS) errStatuses[slot] = "blocked";
        setSlotStatuses(errStatuses);
      }
    },
    [rescheduleBooking]
  );

  useEffect(() => {
    if (rescheduleDate) {
      checkSlots(rescheduleDate);
    }
  }, [rescheduleDate, checkSlots]);

  // Reschedule handler
  const handleReschedule = async () => {
    if (!rescheduleBooking || !rescheduleDate || !rescheduleTime) return;
    setRescheduleLoading(true);
    try {
      const res = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: rescheduleBooking.id,
          newDate: rescheduleDate,
          newTime: rescheduleTime,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookings((prev) =>
          prev.map((b) =>
            b.id === rescheduleBooking.id
              ? { ...b, selectedDate: data.selectedDate, selectedTime: data.selectedTime, googleMeetLink: null }
              : b
          )
        );
        setRescheduleBooking(null);
      }
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
              My Orders & Bookings
            </h1>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="w-8 h-8 text-mauve"
              />
            </div>
            <h2 className="font-heading text-3xl text-navy mb-4">
              Sign in to view your orders
            </h2>
            <p className="text-mauve mb-8 font-accent italic">
              Create an account or sign in to see your order history.
            </p>
            <Link
              href="/account"
              className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
            >
              Go to Account
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            My Orders & Bookings
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            Your orders, bookings, and tracking
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/account"
              className="text-sm text-mauve hover:text-navy transition-colors"
            >
              &larr; Back to Account
            </Link>
          </div>

          {/* Bookings Section */}
          {!loading && bookings.length > 0 && (
            <div className="mb-8">
              <h2 className="font-heading text-2xl text-navy mb-4">Bookings</h2>
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const service = services.find((s) => s.id === booking.serviceId);
                  const within24h =
                    booking.status === "CONFIRMED" &&
                    isWithin24Hours(booking.selectedDate, booking.selectedTime);
                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-xl shadow-[0_4px_12px_rgba(83,91,115,0.08)] px-6 py-5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-4 flex-wrap">
                          <FontAwesomeIcon icon={faCalendarCheck} className="w-5 h-5 text-navy" />
                          <div>
                            <p className="font-heading text-lg text-navy">
                              {service?.name ?? booking.serviceId}
                            </p>
                            <p className="text-sm text-mauve">
                              {booking.selectedDate} at {booking.selectedTime}
                            </p>
                            {booking.addOn && (
                              <p className="text-xs text-mauve">Includes add-on</p>
                            )}
                            {booking.userNotes && (
                              <p className="text-xs text-mauve mt-1">Notes: {booking.userNotes}</p>
                            )}
                            {booking.status === "CONFIRMED" && booking.googleMeetLink && (
                              <a
                                href={booking.googleMeetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-lg hover:bg-navy/90 transition-colors"
                              >
                                Join Google Meet
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full ${BOOKING_STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                          </span>
                        </div>
                        <span className="font-semibold text-navy">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>

                      {/* Cancel / Reschedule buttons for CONFIRMED bookings */}
                      {booking.status === "CONFIRMED" && (
                        <div className="mt-4 pt-4 border-t border-cream">
                          {within24h ? (
                            <p className="text-xs text-mauve italic">
                              Changes unavailable within 24 hours of session
                            </p>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setRescheduleBooking(booking);
                                  setRescheduleDate("");
                                  setRescheduleTime("");
                                  setSlotStatuses({});
                                }}
                                className="px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-lg border border-navy text-navy hover:bg-navy/5 transition-colors"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => setCancelBookingId(booking.id)}
                                className="px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-lg border border-mauve/40 text-mauve hover:bg-mauve/5 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Orders Section */}
          {!loading && bookings.length > 0 && orders.length > 0 && (
            <h2 className="font-heading text-2xl text-navy mb-4">Orders</h2>
          )}

          {loading ? (
            <div className="text-center py-20">
              <p className="text-mauve font-accent italic">
                Loading your orders and bookings...
              </p>
            </div>
          ) : orders.length === 0 && bookings.length === 0 ? (
            <div className="text-center py-20 bg-cream rounded-xl">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="w-8 h-8 text-mauve/40 mb-4"
              />
              <p className="text-mauve font-accent italic mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90 transition-colors tracking-wider uppercase"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-[0_4px_12px_rgba(83,91,115,0.08)] overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cream/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="font-heading text-lg text-navy">
                            Order {formatOrderNumber(order.orderNumber)}
                          </p>
                          <p className="text-xs text-mauve">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-navy">
                          {formatPrice(order.totalAmount / 100)}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`w-4 h-4 text-mauve transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-cream">
                        {/* Tracking */}
                        {order.trackingNumber && (
                          <div className="mt-4 p-4 bg-cream rounded-lg flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon
                                icon={faTruck}
                                className="w-4 h-4 text-navy"
                              />
                              <div>
                                <p className="text-xs text-mauve uppercase tracking-wider">
                                  Tracking —{" "}
                                  {detectCarrier(order.trackingNumber)}
                                </p>
                                <p className="text-sm font-medium text-navy font-mono">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            </div>
                            <a
                              href={getTrackingUrl(order.trackingNumber)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-lg hover:bg-navy/90 transition-colors"
                            >
                              Track Package
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                                className="w-3 h-3"
                              />
                            </a>
                          </div>
                        )}

                        {/* Refund notice */}
                        {order.refundAmount > 0 && (
                          <div className="mt-4 p-3 bg-blush/10 border border-blush/30 rounded-lg">
                            <p className="text-sm text-navy">
                              Refund issued:{" "}
                              <span className="font-semibold">
                                {formatPrice(order.refundAmount / 100)}
                              </span>
                            </p>
                          </div>
                        )}

                        {/* Items */}
                        <div className="mt-4 space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              {item.image && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0 relative">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/shop/${item.productId}`}
                                  className="text-sm font-medium text-navy hover:text-mauve transition-colors line-clamp-1"
                                >
                                  {item.name}
                                </Link>
                                {item.variation && (
                                  <p className="text-xs text-mauve">
                                    {item.variation}
                                  </p>
                                )}
                                <p className="text-xs text-mauve">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-navy flex-shrink-0">
                                {formatPrice(item.unitPrice / 100)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Total */}
                        <div className="mt-4 pt-4 border-t border-cream flex justify-between items-center">
                          <span className="text-sm text-mauve">
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}{" "}
                            item
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            ) !== 1
                              ? "s"
                              : ""}
                          </span>
                          <span className="font-heading text-lg text-navy">
                            Total: {formatPrice(order.totalAmount / 100)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cancel Confirmation Dialog */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !cancelLoading && setCancelBookingId(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="font-heading text-xl text-navy mb-3">
              Cancel Booking?
            </h3>
            <p className="text-sm text-mauve mb-6">
              This will cancel your booking and free up the time slot. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setCancelBookingId(null)}
                disabled={cancelLoading}
                className="px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-lg border border-navy text-navy hover:bg-navy/5 transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-lg bg-mauve/80 text-white hover:bg-mauve transition-colors disabled:opacity-50"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !rescheduleLoading && setRescheduleBooking(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl text-navy">
                Reschedule Booking
              </h3>
              <button
                onClick={() => setRescheduleBooking(null)}
                disabled={rescheduleLoading}
                className="p-1 text-mauve hover:text-navy transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-cream rounded-lg">
              <p className="text-xs text-mauve uppercase tracking-wider mb-1">Current booking</p>
              <p className="text-sm text-navy font-medium">
                {rescheduleBooking.selectedDate} at {rescheduleBooking.selectedTime}
              </p>
            </div>

            {/* Date picker */}
            <label className="block mb-1 text-xs text-mauve uppercase tracking-wider">
              New Date
            </label>
            <input
              type="date"
              min={dateMin || getTodayDateString()}
              max={dateMax || undefined}
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full mb-4 px-3 py-2 border border-mauve/30 rounded-lg text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/30"
            />

            {/* Time slot grid */}
            {rescheduleDate && (
              <>
                <label className="block mb-2 text-xs text-mauve uppercase tracking-wider">
                  Available Times
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {TIME_SLOTS.map((slot) => {
                    const status = slotStatuses[slot];
                    const isAvailable = status === "available";
                    const isLoading = status === "loading";
                    const isSelected = rescheduleTime === slot;

                    return (
                      <button
                        key={slot}
                        onClick={() => isAvailable && setRescheduleTime(slot)}
                        disabled={!isAvailable || isLoading}
                        className={`py-2.5 text-xs font-medium tracking-wider rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-navy text-white border-navy"
                            : isAvailable
                              ? "border-navy/30 text-navy hover:bg-navy/5"
                              : "border-mauve/20 text-mauve/40 cursor-not-allowed"
                        }`}
                      >
                        {isLoading ? "..." : slot}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Confirm */}
            <button
              onClick={handleReschedule}
              disabled={
                !rescheduleDate ||
                !rescheduleTime ||
                rescheduleLoading
              }
              className="w-full py-2.5 text-xs font-medium tracking-wider uppercase rounded-lg bg-navy text-white hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rescheduleLoading ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
