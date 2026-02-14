"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faTiktok } from "@fortawesome/free-brands-svg-icons";

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
              <a
                href="#"
                aria-label="Instagram"
                className="text-white/70 hover:text-blush transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="text-white/70 hover:text-blush transition-colors"
              >
                <FontAwesomeIcon icon={faTiktok} className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@thespiritatelier.com"
                aria-label="Email"
                className="text-white/70 hover:text-blush transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
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
                { href: "/loyalty", label: "Loyalty Program" },
                { href: "/blog", label: "Journal" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-blush text-sm transition-colors"
                  >
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
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-blush text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-heading text-lg mb-4">
              The Atelier Recognizes You
            </h4>
            <p className="text-white/70 text-sm mb-4">
              Earn credits for purchases, referrals, and seasonal milestones.
              Redeem them toward the tools that continue your practice.
            </p>

            <Link
              href="/loyalty"
              className="inline-block px-2 py-3 text-sm bg-gradient-to-r from-cream via-white to-cream text-navy font-semibold tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
            >
              ✨ View Loyalty Program ✨
            </Link>
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
