"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

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
              <svg className="w-8 h-8 text-mauve" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
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
                <div key={item.productId} className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(83,91,115,0.08)] flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-cream to-light-blush flex-shrink-0 flex items-center justify-center">
                    <span className="font-heading text-2xl text-navy/10">{item.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/shop/${item.productId}`} className="font-heading text-lg text-navy hover:text-mauve transition-colors">{item.name}</Link>
                        {item.variation && <p className="text-sm text-mauve">{item.variation}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-mauve hover:text-navy transition-colors p-1" aria-label="Remove">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-navy/20 rounded-lg">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">-</button>
                        <span className="px-3 py-1.5 text-sm font-medium text-navy">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 text-navy text-sm hover:bg-cream transition-colors">+</button>
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
                  <div className="flex justify-between text-sm">
                    <span className="text-navy/70">Shipping</span>
                    <span className="text-navy font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Discount code"
                      className="flex-1 px-3 py-2 border border-navy/20 rounded-lg text-sm text-navy placeholder:text-mauve focus:outline-none focus:border-navy" />
                    <button className="px-4 py-2 bg-navy/10 text-navy text-sm rounded-lg hover:bg-navy/20 transition-colors">Apply</button>
                  </div>
                  <div className="pt-3 border-t border-navy/10 flex justify-between">
                    <span className="font-semibold text-navy">Total</span>
                    <span className="font-semibold text-navy text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setCheckingOut(true); setTimeout(() => { clearCart(); setCheckingOut(false); }, 1500); }}
                  className={`w-full py-3.5 font-medium rounded-lg text-sm tracking-wider uppercase transition-colors ${checkingOut ? "bg-green-600 text-white" : "bg-navy text-white hover:bg-navy/90"}`}
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
