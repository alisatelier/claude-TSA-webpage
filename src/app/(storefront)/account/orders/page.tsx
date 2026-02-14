"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faChevronDown,
  faTruck,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

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

function detectCarrier(trackingNumber: string): string {
  const tn = trackingNumber.trim().toUpperCase();
  if (/^1Z/.test(tn)) return "UPS";
  if (/^(94|92|93|42)\d{18,20}$/.test(tn)) return "USPS";
  if (/^\d{12,15}$/.test(tn)) return "FedEx";
  if (/^[A-Z0-9]{13}$/.test(tn) || /^[A-Z0-9]{16}$/.test(tn))
    return "Canada Post";
  return "Parcel Tracker";
}

function getTrackingUrl(trackingNumber: string): string {
  const tn = trackingNumber.trim();
  const carrier = detectCarrier(tn);
  switch (carrier) {
    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`;
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`;
    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`;
    case "Canada Post":
      return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodeURIComponent(tn)}`;
    default:
      return `https://parcelsapp.com/en/tracking/${encodeURIComponent(tn)}`;
  }
}

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

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/user/orders")
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  if (!isLoggedIn) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
              My Orders
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
            My Orders
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            Your order history and tracking
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

          {loading ? (
            <div className="text-center py-20">
              <p className="text-mauve font-accent italic">
                Loading your orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
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
                            Order #{order.orderNumber}
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
    </>
  );
}
