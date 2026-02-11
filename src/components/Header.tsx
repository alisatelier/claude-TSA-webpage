"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faHeart, faBagShopping, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Shop",
    children: [
      { href: "/shop", label: "All Items" },
      { href: "/shop/whims-whispers-tarot", label: "Tarot Cards" },
      { href: "/shop/whims-whispers-journal", label: "Journal" },
      { href: "/shop/norse-runes-select", label: "Norse Runes" },
      { href: "/shop/whims-whispers-spirit-board", label: "Spirit Board" },
      { href: "/shop/bookstore", label: "Bookstore" },
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
  const { isLoggedIn } = useAuth();

  return (
    <header className="sticky top-0 z-5 bg-navy w-full">
      {/* Glowing bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 shadow-[0_0_8px_2px_rgba(255,255,255,0.15)]" />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Title (left) */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/images/logo-white.png"
              alt="The Spirit Atelier"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <span className="font-heading text-white text-2xl hidden sm:block lg:block">
             THE SPIIT ATELIE
            </span>
            {/* Mobile: centered title only */}
          </Link>

          {/* Mobile: centered title */}
          <span className="font-heading text-white text-2xl sm:hidden absolute left-1/2 -translate-x-1/2">
            THE SPIIT ATELIE
          </span>

          {/* Desktop nav (right aligned) */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setShopDropdown(true)}
                    onMouseLeave={() => setShopDropdown(false)}
                  >
                    <Link
                      href={link.href}
                      className="font-heading text-white text-base tracking-wide hover:text-light-blush transition-colors"
                    >
                      {link.label}
                    </Link>
                    {shopDropdown && (
                      <div className="absolute top-full right-0 pt-2 w-52">
                        <div className="bg-navy rounded-lg shadow-lg border border-white/10 py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 font-heading text-sm text-white/80 hover:text-light-blush hover:bg-white/5 transition-colors"
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
                    key={link.label}
                    href={link.href}
                    className="font-heading text-white text-base tracking-wide hover:text-light-blush transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3 ml-4 border-l border-white/20 pl-4">
              <button className="p-2 text-white hover:text-light-blush transition-colors" aria-label="Search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
              </button>
              <Link href="/account" className="p-2 text-white hover:text-light-blush transition-colors" aria-label="Account">
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
              </Link>
              <Link href={isLoggedIn ? "/wishlist" : "/loyalty"} className="p-2 text-white hover:text-light-blush transition-colors relative" aria-label="Wishlist">
                <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blush text-navy text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="p-2 text-white hover:text-light-blush transition-colors relative" aria-label="Cart">
                <FontAwesomeIcon icon={faBagShopping} className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blush text-navy text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile: hamburger + cart */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/cart" className="p-2 text-white hover:text-light-blush transition-colors relative" aria-label="Cart">
              <FontAwesomeIcon icon={faBagShopping} className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush text-navy text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10">
          <nav className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block font-heading text-white text-base py-2 hover:text-light-blush transition-colors"
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
                        className="block font-heading text-white/60 text-sm py-1 hover:text-light-blush transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-white/10 flex gap-6">
              <Link href="/account" className="font-heading text-white text-sm" onClick={() => setMobileOpen(false)}>Account</Link>
              <Link href={isLoggedIn ? "/wishlist" : "/loyalty"} className="font-heading text-white text-sm" onClick={() => setMobileOpen(false)}>Wishlist</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
