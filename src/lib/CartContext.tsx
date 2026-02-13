"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CART_STORAGE_KEY = "spirit-atelier-cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  cadPrice?: number;
  quantity: number;
  variation?: string;
  image: string;
  isService?: boolean;
  holdId?: string;
  selectedDate?: string;
  selectedTime?: string;
}

export interface Toast {
  message: string;
  link: { href: string; label: string };
}

interface CartContextType {
  items: CartItem[];
  wishlist: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variation?: string) => void;
  updateQuantity: (productId: string, quantity: number, variation?: string) => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  clearCart: () => void;
  toast: Toast | null;
  dismissToast: () => void;
  appliedCredits: number;
  creditDiscount: number;
  applyCredits: (amount: number) => void;
  removeCredits: () => void;
  checkout: (currency?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): { items: CartItem[]; wishlist: string[] } {
  if (typeof window === "undefined") return { items: [], wishlist: [] };
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { items: parsed.items || [], wishlist: parsed.wishlist || [] };
    }
  } catch {
    // ignore
  }
  return { items: [], wishlist: [] };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, recordPurchase, deductCredits, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [appliedCredits, setAppliedCredits] = useState(0);
  const [mounted, setMounted] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored.items);
    setWishlist(stored.wishlist);
    setMounted(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, wishlist }));
  }, [items, wishlist, mounted]);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback((t: Toast) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(t);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 80000);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.variation === item.variation);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variation === item.variation
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variation?: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variation === variation)));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variation?: string) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variation === variation)));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.variation === variation ? { ...i, quantity } : i))
    );
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const isRemoving = prev.includes(productId);
      if (!isRemoving) {
        if (isLoggedIn) {
          showToast({
            message: "Added to your Wishlist",
            link: { href: "/wishlist", label: "View Wishlist" },
          });
        } else {
          showToast({
            message: "Earn Ritual Credits with every purchase",
            link: { href: "/loyalty", label: "Join the Loyalty Program" },
          });
        }
      }
      return isRemoving
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
  }, [showToast, isLoggedIn]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCredits(0);
  }, []);

  const creditDiscount = appliedCredits === 500 ? 20 : appliedCredits === 250 ? 10 : 0;

  const applyCredits = useCallback((amount: number) => {
    if (amount !== 250 && amount !== 500) return;
    // Re-check current balance from user state
    if (!user || user.loyalty.currentCredits < amount) return;
    setAppliedCredits(amount);
  }, [user]);

  const removeCredits = useCallback(() => {
    setAppliedCredits(0);
  }, []);

  const checkout = useCallback((currency?: string) => {
    if (items.length === 0) return;
    const productIds = items.map((i) => i.productId);
    // Use CAD price for loyalty credit calculation
    const cadSubtotal = items.reduce((sum, i) => sum + (i.cadPrice ?? i.price) * i.quantity, 0);

    // Re-validate credits before deducting (prevents stale state / multi-tab)
    let validCredits = appliedCredits;
    if (validCredits > 0) {
      if (!user || user.loyalty.currentCredits < validCredits) {
        validCredits = 0;
      }
    }

    const discount = validCredits === 500 ? 20 : validCredits === 250 ? 10 : 0;
    if (discount > cadSubtotal) {
      validCredits = 0;
    }
    const actualDiscount = validCredits === 500 ? 20 : validCredits === 250 ? 10 : 0;
    const finalCADTotal = Math.max(0, cadSubtotal - actualDiscount);

    if (validCredits > 0) {
      deductCredits(validCredits, `Redeemed ${validCredits} credits ($${actualDiscount} off)`);
    }

    recordPurchase(productIds, finalCADTotal, currency);
    setItems([]);
    setAppliedCredits(0);
  }, [items, appliedCredits, deductCredits, recordPurchase, user]);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        cartCount,
        wishlistCount,
        cartTotal,
        clearCart,
        toast,
        dismissToast,
        appliedCredits,
        creditDiscount,
        applyCredits,
        removeCredits,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
