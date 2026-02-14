"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { useBooking } from "@/lib/BookingContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { calculateTier } from "@/lib/loyalty-utils";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faXmark, faStar, faCheck, faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import BookingTimer from "@/components/BookingTimer";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, checkout, appliedCredits, creditDiscount, applyCredits, removeCredits } = useCart();
  const { user, isLoggedIn } = useAuth();
  const { getHoldById, confirmBooking, releaseHold, holds } = useBooking();
  const { formatPrice, currency } = useCurrency();
  const [discountCode, setDiscountCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [expiredHoldIds, setExpiredHoldIds] = useState<Set<string>>(new Set());
  const [orderComplete, setOrderComplete] = useState<{
    creditsEarned: number;
    newBalance: number;
    creditsRedeemed: number;
    discountApplied: number;
    newTier: string;
    previousTier: string;
    confirmedBookings: Array<{ serviceName: string; date: string; time: string }>;
  } | null>(null);

  const serviceItems = items.filter((i) => i.isService);
  const productItems = items.filter((i) => !i.isService);

  // Check for expired holds and auto-remove them
  const checkExpiredHolds = useCallback(() => {
    const newExpired = new Set<string>();
    for (const item of serviceItems) {
      if (item.holdId) {
        const hold = getHoldById(item.holdId);
        if (!hold || hold.expiresAt <= Date.now()) {
          newExpired.add(item.holdId);
        }
      }
    }
    if (newExpired.size > 0) {
      setExpiredHoldIds(newExpired);
    }
  }, [serviceItems, getHoldById]);

  // Run check on mount and when holds change
  useEffect(() => {
    checkExpiredHolds();
  }, [holds, checkExpiredHolds]);

  // Auto-remove expired service items
  useEffect(() => {
    if (expiredHoldIds.size === 0) return;
    for (const item of items) {
      if (item.isService && item.holdId && expiredHoldIds.has(item.holdId)) {
        removeFromCart(item.productId, item.variation);
      }
    }
  }, [expiredHoldIds, items, removeFromCart]);

  const handleHoldExpire = useCallback((holdId: string, productId: string) => {
    releaseHold(holdId);
    removeFromCart(productId);
    setExpiredHoldIds((prev) => {
      const next = new Set(prev);
      next.add(holdId);
      return next;
    });
  }, [releaseHold, removeFromCart]);

  const handleRemoveService = (productId: string, holdId?: string) => {
    if (holdId) {
      releaseHold(holdId);
    }
    removeFromCart(productId);
  };

  const hasExpiredHolds = serviceItems.some((item) => {
    if (!item.holdId) return false;
    const hold = getHoldById(item.holdId);
    return !hold || hold.expiresAt <= Date.now();
  });

  if (orderComplete) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Order Confirmed</h1>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-heading text-3xl text-navy mb-4">Thank you for your purchase!</h2>
            <p className="text-mauve mb-6 font-accent italic">Your order is being lovingly prepared.</p>

            {/* Confirmed booking details */}
            {orderComplete.confirmedBookings.length > 0 && (
              <div className="bg-cream rounded-xl p-6 mb-6 text-left space-y-3">
                <h3 className="font-heading text-lg text-navy text-center mb-2">Booking Confirmed</h3>
                {orderComplete.confirmedBookings.map((booking, i) => (
                  <div key={i} className="flex flex-col gap-1 text-sm">
                    <span className="font-semibold text-navy">{booking.serviceName}</span>
                    <div className="flex items-center gap-4 text-navy/70">
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="w-3.5 h-3.5" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                        {booking.time}
                      </span>
                    </div>
                    {i < orderComplete.confirmedBookings.length - 1 && (
                      <div className="border-t border-navy/10 mt-2" />
                    )}
                  </div>
                ))}
                <p className="text-xs text-mauve text-center pt-2">A confirmation email will be sent shortly.</p>
              </div>
            )}

            {isLoggedIn && (
              <div className="bg-cream rounded-xl p-6 mb-8 space-y-3">
                {orderComplete.creditsRedeemed > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-teal-400 font-semibold">You redeemed {orderComplete.creditsRedeemed} Ritual Credits (-{formatPrice(orderComplete.discountApplied)})</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faStar} className="w-5 h-5 text-blush" />
                  <span className="text-navy font-semibold">+{orderComplete.creditsEarned} Ritual Credits earned</span>
                </div>
                <p className="text-sm text-navy">New balance: <span className="font-semibold">{orderComplete.newBalance} credits</span></p>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-navy text-white text-xs font-medium tracking-wider uppercase rounded-full">{orderComplete.newTier}</span>
                  {orderComplete.newTier !== orderComplete.previousTier && (
                    <span className="text-sm text-teal-400 font-medium">Tier upgraded!</span>
                  )}
                </div>
                {orderComplete.creditsRedeemed > 0 && (
                  <p className="text-xs text-mauve italic">Your Ritual Credit redemption has been applied.</p>
                )}
              </div>
            )}
            <Link href="/shop" className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
              Continue Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <section className="bg-navy py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Your Cart</h1>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-cream rounded-full mx-auto mb-6 flex items-center justify-center">
              <FontAwesomeIcon icon={faBagShopping} className="w-8 h-8 text-mauve" />
            </div>
            <h2 className="font-heading text-3xl text-navy mb-4">Your cart is empty</h2>
            <p className="text-mauve mb-8 font-accent italic">Begin your journey by exploring our collection.</p>
            <Link href="/shop" className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
              Continue Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  const finalTotal = Math.max(0, cartTotal - creditDiscount);
  const creditsEarnable = Math.floor(finalTotal);

  const handleCheckout = () => {
    if (checkingOut) return;
    setCheckoutError("");

    // Validate all service holds are still active
    for (const item of serviceItems) {
      if (item.holdId) {
        const hold = getHoldById(item.holdId);
        if (!hold || hold.expiresAt <= Date.now()) {
          setCheckoutError("A service hold has expired. Please remove expired items and try again.");
          return;
        }
      }
    }

    // Validate credit balance before processing
    if (appliedCredits > 0 && user) {
      if (user.loyalty.currentCredits < appliedCredits) {
        setCheckoutError("Your credit balance has changed. Please re-apply your credits.");
        removeCredits();
        return;
      }
      if (cartTotal < creditDiscount) {
        setCheckoutError("Cart total is less than the discount. Please adjust your credits.");
        removeCredits();
        return;
      }
    }

    setCheckingOut(true);
    const creditsEarned = creditsEarnable;
    const creditsRedeemed = appliedCredits;
    const discountApplied = creditDiscount;
    const previousTier = user ? calculateTier(user.loyalty.lifetimeCredits) : "Seeker";
    const newBalance = user ? user.loyalty.currentCredits - creditsRedeemed + creditsEarned : 0;
    const newLifetime = user ? user.loyalty.lifetimeCredits + creditsEarned : 0;
    const newTier = calculateTier(newLifetime);

    // Collect service hold IDs before checkout clears the cart
    const serviceHoldIds = serviceItems
      .filter((i) => i.holdId)
      .map((i) => ({ holdId: i.holdId!, name: i.name, date: i.selectedDate || "", time: i.selectedTime || "" }));

    setTimeout(async () => {
      // Confirm all service bookings
      const confirmedBookings: Array<{ serviceName: string; date: string; time: string }> = [];
      for (const { holdId, name, date, time } of serviceHoldIds) {
        const session = await confirmBooking(holdId);
        if (session) {
          confirmedBookings.push({ serviceName: name, date, time });
        }
      }

      checkout(currency);
      setCheckingOut(false);
      setOrderComplete({ creditsEarned, newBalance, creditsRedeemed, discountApplied, newTier, previousTier, confirmedBookings });
    }, 1500);
  };

  const canApply250 = isLoggedIn && user && user.loyalty.currentCredits >= 250;
  const canApply500 = isLoggedIn && user && user.loyalty.currentCredits >= 500;

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Your Cart</h1>
          <p className="font-accent italic text-white/70 text-lg">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Expired hold warning */}
          {hasExpiredHolds && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              A service hold has expired. The time slot has been released. Please remove the expired item and rebook if needed.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const isService = item.isService;
                const hold = isService && item.holdId ? getHoldById(item.holdId) : null;
                const isExpired = isService && item.holdId && !hold;

                return (
                  <div key={`${item.productId}-${item.variation || "default"}`} className={`bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)] flex gap-4 ${isExpired ? "opacity-60" : ""}`}>
                    {isService ? (
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-cream to-light-blush flex-shrink-0 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCalendar} className="w-8 h-8 text-navy/20" />
                      </div>
                    ) : item.image ? (
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-cream to-light-blush flex-shrink-0 flex items-center justify-center">
                        <span className="font-heading text-2xl text-navy/10">{item.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          {isService ? (
                            <span className="font-heading text-lg text-navy">{item.name}</span>
                          ) : (
                            <Link href={`/shop/${item.productId}`} className="font-heading text-lg text-navy hover:text-mauve transition-colors">{item.name}</Link>
                          )}
                          {item.variation && <p className="text-sm text-mauve">{item.variation}</p>}
                          {isService && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-navy/60">
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                                {item.selectedDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                {item.selectedTime}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => isService ? handleRemoveService(item.productId, item.holdId) : removeFromCart(item.productId, item.variation)}
                          className="text-mauve hover:text-navy transition-colors p-1"
                          aria-label="Remove"
                        >
                          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {isService ? (
                          <div>
                            {hold && !isExpired ? (
                              <BookingTimer
                                expiresAt={hold.expiresAt}
                                onExpire={() => handleHoldExpire(item.holdId!, item.productId)}
                                variant="inline"
                              />
                            ) : isExpired ? (
                              <span className="text-xs font-medium text-red-500">Hold expired</span>
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center border border-navy/20 rounded-lg">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variation)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">-</button>
                            <span className="px-3 py-1.5 text-sm font-medium text-navy">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variation)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">+</button>
                          </div>
                        )}
                        <span className="font-semibold text-navy">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="bg-cream rounded-xl p-6 sticky top-24">
                <h3 className="font-heading text-xl text-navy mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/70">Subtotal</span>
                    <span className="text-navy font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  {creditDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-400">Ritual Credits ({appliedCredits} credits)</span>
                      <span className="text-teal-400 font-medium">-{formatPrice(creditDiscount)}</span>
                    </div>
                  )}
                  {productItems.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-navy/70">Shipping</span>
                      <span className="text-navy font-medium">Calculated at checkout</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Discount code"
                      className="flex-1 px-3 py-2 border border-navy/20 rounded-lg text-sm text-navy placeholder:text-mauve focus:outline-none focus:border-navy" />
                    <button className="px-4 py-2 bg-navy/10 text-navy text-sm rounded-lg hover:bg-navy/20 transition-colors">Apply</button>
                  </div>

                  {/* Credit Redemption */}
                  {isLoggedIn && user && user.loyalty.currentCredits >= 250 && (
                    <div className="pt-3 border-t border-navy/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-blush" />
                        <span className="text-sm font-medium text-navy">Redeem Ritual Credits</span>
                      </div>
                      <p className="text-xs text-mauve mb-2">You have {user.loyalty.currentCredits} credits</p>
                      <div className="flex gap-2">
                        {canApply250 && (
                          <button
                            onClick={() => appliedCredits === 250 ? removeCredits() : applyCredits(250)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${appliedCredits === 250 ? "bg-navy text-white border-navy" : "border-navy/20 text-navy hover:border-navy"}`}
                          >
                            250 = $5 off
                          </button>
                        )}
                        {canApply500 && (
                          <button
                            onClick={() => appliedCredits === 500 ? removeCredits() : applyCredits(500)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${appliedCredits === 500 ? "bg-navy text-white border-navy" : "border-navy/20 text-navy hover:border-navy"}`}
                          >
                            500 = $10 off
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-navy/10 flex justify-between">
                    <span className="font-semibold text-navy">Total</span>
                    <span className="font-semibold text-navy text-lg">{formatPrice(finalTotal)}</span>
                  </div>

                  {isLoggedIn && (
                    <p className="text-xs text-mauve">
                      You&apos;ll earn {creditsEarnable} Ritual Credits with this purchase
                    </p>
                  )}
                </div>
                {checkoutError && (
                  <div className="mb-3 p-3 bg-blush/10 border border-blush/30 rounded-lg text-sm text-navy">
                    {checkoutError}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || hasExpiredHolds}
                  className={`w-full py-3.5 font-medium rounded-lg text-sm tracking-wider uppercase transition-colors ${checkingOut || hasExpiredHolds ? "bg-[#A69FA5] text-white cursor-not-allowed" : "bg-navy text-white hover:bg-navy/90"}`}
                >{checkingOut ? "Processing..." : "Proceed to Checkout"}</button>
                <Link href="/shop" className="block text-center text-sm text-mauve hover:text-navy mt-4 transition-colors">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
