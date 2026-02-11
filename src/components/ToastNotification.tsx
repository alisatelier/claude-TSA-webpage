"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function ToastNotification() {
  const { toast, dismissToast } = useCart();
  const { isLoggedIn } = useAuth();

  if (!toast) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/25 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-3xl shadow-[0_25px_70px_rgba(83,91,115,0.25)] border border-cream p-10 max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={dismissToast}
          className="absolute top-5 right-5 text-mauve hover:text-navy transition-colors"
          aria-label="Dismiss"
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-5">
          {/* Heart Icon */}
          <div className="w-14 h-14 bg-[#F2E9E9]/30 rounded-full flex items-center justify-center shadow-inner">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-blush/70 text-4xl"
            />
          </div>

          <p className="text-lg text-navy font-semibold leading-relaxed">
            {toast.message}
          </p>
          {!isLoggedIn && (
            <p className="text-sm text-navy/70 leading-relaxed">
             Create an account to begin earning Ritual Credits and unlock wishlist access & purchase history. Already purchased? You&#39;re automatically enrolled.
            </p>
          )}

          <Link
            href={toast.link.href}
            onClick={dismissToast}
            className="inline-block px-8 py-3 bg-gradient-to-r from-cream via-white to-cream text-navy font-semibold tracking-wider uppercase rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
          >
            {toast.link.label}
          </Link>

          <p className="text-xs text-mauve/60 italic">Tap the ✕ to close</p>
        </div>
      </div>
    </div>
  );
}
