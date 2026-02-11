"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div>
            <Image
              src="/images/logo-white.png"
              alt="The Spirit Atelier"
              width={60}
              height={60}
              className="h-14 w-auto mb-4"
            />
            <p className="font-accent italic text-white/80 text-sm leading-relaxed mb-6">
              For You, On Your Journey
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-white/70 hover:text-blush transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="text-white/70 hover:text-blush transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.12V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                </svg>
              </a>
              <a href="mailto:hello@thespiritatelier.com" aria-label="Email" className="text-white/70 hover:text-blush transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/services", label: "Services" },
                { href: "/blog", label: "Journal" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-blush text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-heading text-lg mb-4">Customer Care</h4>
            <ul className="space-y-3">
              {[
                { href: "/faq", label: "FAQ" },
                { href: "/shipping-returns", label: "Shipping & Returns" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-blush text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-heading text-lg mb-4">Stay Connected</h4>
            <p className="text-white/70 text-sm mb-4">
              Join our journey — receive spiritual insights and exclusive offers.
            </p>
            {subscribed ? (
              <p className="text-blush text-sm font-accent italic">
                Welcome to the journey. Check your inbox.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-blush transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blush text-navy rounded-lg text-sm font-medium hover:bg-light-blush transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; 2026 The Spirit Atelier. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-white/40">
            <span className="text-xs">Secure Checkout</span>
            <span className="text-white/20">|</span>
            <span className="text-xs">SSL Encrypted</span>
            <span className="text-white/20">|</span>
            <span className="text-xs">Handmade with Intention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
