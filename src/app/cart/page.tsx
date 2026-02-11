"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { calculateTier } from "@/lib/loyalty-utils";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faXmark, faStar, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, checkout, appliedCredits, creditDiscount, applyCredits, removeCredits } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [discountCode, setDiscountCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderComplete, setOrderComplete] = useState<{
    creditsEarned: number;
    newBalance: number;
    creditsRedeemed: number;
    discountApplied: number;
    newTier: string;
    previousTier: string;
  } | null>(null);

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
            {isLoggedIn && (
              <div className="bg-cream rounded-xl p-6 mb-8 space-y-3">
                {orderComplete.creditsRedeemed > 0 && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-teal-400 font-semibold">You redeemed {orderComplete.creditsRedeemed} Ritual Credits (-${orderComplete.discountApplied})</span>
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
    if (checkingOut) return; // double-submit prevention
    setCheckoutError("");

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

    setTimeout(() => {
      checkout();
      setCheckingOut(false);
      setOrderComplete({ creditsEarned, newBalance, creditsRedeemed, discountApplied, newTier, previousTier });
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variation || "default"}`} className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)] flex gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-cream to-light-blush flex-shrink-0 flex items-center justify-center">
                      <span className="font-heading text-2xl text-navy/10">{item.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/shop/${item.productId}`} className="font-heading text-lg text-navy hover:text-mauve transition-colors">{item.name}</Link>
                        {item.variation && <p className="text-sm text-mauve">{item.variation}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.productId, item.variation)} className="text-mauve hover:text-navy transition-colors p-1" aria-label="Remove">
                        <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-navy/20 rounded-lg">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variation)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">-</button>
                        <span className="px-3 py-1.5 text-sm font-medium text-navy">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variation)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">+</button>
                      </div>
                      <span className="font-semibold text-navy">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-cream rounded-xl p-6 sticky top-24">
                <h3 className="font-heading text-xl text-navy mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/70">Subtotal</span>
                    <span className="text-navy font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  {creditDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-400">Ritual Credits ({appliedCredits} credits)</span>
                      <span className="text-teal-400 font-medium">-${creditDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/70">Shipping</span>
                    <span className="text-navy font-medium">Calculated at checkout</span>
                  </div>
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
                            250 = $10 off
                          </button>
                        )}
                        {canApply500 && (
                          <button
                            onClick={() => appliedCredits === 500 ? removeCredits() : applyCredits(500)}
                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${appliedCredits === 500 ? "bg-navy text-white border-navy" : "border-navy/20 text-navy hover:border-navy"}`}
                          >
                            500 = $20 off
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-navy/10 flex justify-between">
                    <span className="font-semibold text-navy">Total</span>
                    <span className="font-semibold text-navy text-lg">${finalTotal.toFixed(2)}</span>
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
                  disabled={checkingOut}
                  className={`w-full py-3.5 font-medium rounded-lg text-sm tracking-wider uppercase transition-colors ${checkingOut ? "bg-[#A69FA5] text-white cursor-not-allowed" : "bg-navy text-white hover:bg-navy/90"}`}
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
