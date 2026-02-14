"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function ToastNotification() {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  return (
    <div className="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-lg border border-cream/80 px-5 py-4 max-w-xs flex items-center gap-3">
        <FontAwesomeIcon icon={faHeart} className="text-blush text-lg flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-navy font-medium">{toast.message}</p>
          <Link
            href={toast.link.href}
            onClick={dismissToast}
            className="text-xs text-mauve hover:text-navy transition-colors underline"
          >
            {toast.link.label}
          </Link>
        </div>
        <button
          onClick={dismissToast}
          className="text-mauve/50 hover:text-navy transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
