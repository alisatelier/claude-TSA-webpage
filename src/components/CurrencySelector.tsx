"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency, type CurrencyCode } from "@/lib/CurrencyContext";

const CURRENCIES: { code: CurrencyCode; label: string; flag: string }[] = [
  { code: "CAD", label: "CAD $", flag: "🇨🇦" },
  { code: "USD", label: "USD $", flag: "🇺🇸" },
  { code: "GBP", label: "GBP £", flag: "🇬🇧" },
  { code: "AUD", label: "AUD $", flag: "🇦🇺" },
  { code: "EUR", label: "EUR €", flag: "🇪🇺" },
];

export default function CurrencySelector({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { currency, setCurrency, isLocked } = useCurrency();
  const [open, setOpen] = useState(false);
  const [showLockMessage, setShowLockMessage] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentFlag = CURRENCIES.find((c) => c.code === currency)?.flag;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowLockMessage(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLockedClick = () => {
    setShowLockMessage(true);
    setTimeout(() => setShowLockMessage(false), 5000);
  };

  if (variant === "mobile") {
    if (isLocked) {
      return (
        <div>
          <button
            onClick={handleLockedClick}
            className="px-3 py-1.5 bg-white text-navy text-xs font-medium tracking-wide rounded-lg transition-colors flex items-center gap-2"
          >
            <span>{currentFlag}</span>
            <span>{currency}</span>
            <svg
              className="w-3 h-3 text-navy/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </button>
          {showLockMessage && (
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Your account is set to transact in {currency}. For consistency and
              loyalty pricing accuracy, currency cannot be changed after your
              first purchase.
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide rounded-lg transition-colors flex items-center gap-1.5 ${
              currency === c.code
                ? "bg-white text-navy"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.code}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop variant
  if (isLocked) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={handleLockedClick}
          className="px-2.5 py-1.5 bg-white text-navy text-xs font-medium tracking-wide rounded-md transition-colors flex items-center gap-1.5"
        >
          <span>{currentFlag}</span>
          <span>{currency}</span>
          <svg
            className="w-3 h-3 text-navy/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </button>
        {showLockMessage && (
          <div className="absolute top-full right-0 pt-2 w-64 z-50">
            <div className="bg-navy rounded-lg shadow-lg border border-white/10 p-4">
              <p className="text-xs text-white/70 leading-relaxed">
                Your account is set to transact in {currency}. For consistency
                and loyalty pricing accuracy, currency cannot be changed after
                your first purchase.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2.5 py-1.5 bg-white text-navy hover:bg-white/90 text-xs font-medium tracking-wide rounded-md transition-colors flex items-center gap-1.5"
      >
        <span>{currentFlag}</span>
        <span>{currency}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 w-32 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-navy/10 py-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-xs font-medium tracking-wide transition-colors ${
                  currency === c.code
                    ? "text-navy bg-cream"
                    : "text-navy/70 hover:text-navy hover:bg-cream/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
