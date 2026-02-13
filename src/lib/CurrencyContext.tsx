"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CURRENCY_STORAGE_KEY = "spirit-atelier-currency";

export type CurrencyCode = "CAD" | "USD" | "GBP" | "AUD" | "EUR";

export interface CurrencyPrices {
  CAD: number;
  USD: number;
  GBP: number;
  AUD: number;
  EUR: number;
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  CAD: "$",
  USD: "$",
  GBP: "\u00A3",
  AUD: "$",
  EUR: "\u20AC",
};

// Currencies that need their code appended to disambiguate $ symbol
const NEEDS_CODE: Record<CurrencyCode, boolean> = {
  CAD: true,
  USD: true,
  GBP: false,
  AUD: true,
  EUR: false,
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  getProductPrice: (prices: CurrencyPrices) => number;
  getCADEquivalent: (prices: CurrencyPrices) => number;
  isLocked: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const VALID_CURRENCIES = ["CAD", "USD", "GBP", "AUD", "EUR"];

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [currency, setCurrencyState] = useState<CurrencyCode>("CAD");
  const [mounted, setMounted] = useState(false);

  // Determine if the user's currency is locked
  const lockedCurrency = isLoggedIn && user?.loyalty.lockedCurrency
    ? (user.loyalty.lockedCurrency as CurrencyCode)
    : null;
  const isLocked = lockedCurrency !== null;

  useEffect(() => {
    // If currency is locked, always use the locked currency
    if (lockedCurrency) {
      setCurrencyState(lockedCurrency);
      setMounted(true);
      return;
    }
    try {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
      if (stored && VALID_CURRENCIES.includes(stored)) {
        setCurrencyState(stored);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, [lockedCurrency]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    // Prevent currency change if locked
    if (isLocked) return;
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, [isLocked]);

  const formatPrice = useCallback(
    (amount: number): string => {
      // Use mounted currency, default CAD for SSR
      const code = mounted ? currency : "CAD";
      const symbol = CURRENCY_SYMBOLS[code];
      const formatted = Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);
      if (NEEDS_CODE[code]) {
        return `${symbol}${formatted} ${code}`;
      }
      return `${symbol}${formatted}`;
    },
    [currency, mounted]
  );

  const getProductPrice = useCallback(
    (prices: CurrencyPrices): number => {
      if (!prices) return 0;
      const code = mounted ? currency : "CAD";
      return prices[code];
    },
    [currency, mounted]
  );

  const getCADEquivalent = useCallback(
    (prices: CurrencyPrices): number => {
      if (!prices) return 0;
      return prices.CAD;
    },
    []
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, getProductPrice, getCADEquivalent, isLocked }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
