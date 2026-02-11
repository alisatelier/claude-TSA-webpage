"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?category=Ritual+Tools", label: "Ritual Tools" },
      { href: "/shop?category=Divination+Tools", label: "Divination Tools" },
      { href: "/shop?category=Literature", label: "Literature" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const { cartCount, wishlistCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-dark.png"
              alt="The Spirit Atelier"
              width={60}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setShopDropdown(true)}
                  onMouseLeave={() => setShopDropdown(false)}
                >
                  <Link
                    href={link.href}
                    className="text-navy font-body text-sm font-medium tracking-wide hover:text-mauve transition-colors"
                  >
                    {link.label}
                  </Link>
                  {shopDropdown && (
                    <div className="absolute top-full left-0 pt-2 w-48">
                      <div className="bg-white rounded-lg shadow-lg border border-cream py-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-navy hover:bg-cream transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-navy font-body text-sm font-medium tracking-wide hover:text-mauve transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-navy hover:text-mauve transition-colors" aria-label="Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Account */}
            <Link href="/account" className="p-2 text-navy hover:text-mauve transition-colors hidden sm:block" aria-label="Account">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-navy hover:text-mauve transition-colors relative hidden sm:block" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush text-navy text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {/* Cart */}
            <Link href="/cart" className="p-2 text-navy hover:text-mauve transition-colors relative" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush text-navy text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-cream">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="block text-navy font-body text-base font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4 space-y-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block text-mauve text-sm py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-cream flex gap-6">
              <Link href="/account" className="text-navy text-sm font-medium" onClick={() => setMobileOpen(false)}>Account</Link>
              <Link href="/wishlist" className="text-navy text-sm font-medium" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
