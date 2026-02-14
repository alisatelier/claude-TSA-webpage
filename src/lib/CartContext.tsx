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
  const [dbLoaded, setDbLoaded] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevLoggedIn = useRef(false);

  // Hydrate from localStorage (always, as initial state)
  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored.items);
    setWishlist(stored.wishlist);
    setMounted(true);
  }, []);

  // When user logs in: fetch DB cart/wishlist and merge localStorage cart
  useEffect(() => {
    if (!mounted) return;

    if (isLoggedIn && !prevLoggedIn.current) {
      // Just logged in — merge guest cart and fetch DB state
      const mergeAndFetch = async () => {
        try {
          // Merge current localStorage items into DB
          if (items.length > 0) {
            await fetch("/api/user/cart/merge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
          }

          // Fetch DB cart
          const cartRes = await fetch("/api/user/cart");
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            setItems(cartData.items);
          }

          // Fetch DB wishlist
          const wishRes = await fetch("/api/user/wishlist");
          if (wishRes.ok) {
            const wishData = await wishRes.json();
            setWishlist(wishData.items);
          }

          // Clear localStorage cart data (now in DB)
          localStorage.removeItem(CART_STORAGE_KEY);
          setDbLoaded(true);
        } catch {
          // keep current state on error
        }
      };
      mergeAndFetch();
    } else if (!isLoggedIn && prevLoggedIn.current) {
      // Just logged out — reload from localStorage
      const stored = loadCartFromStorage();
      setItems(stored.items);
      setWishlist(stored.wishlist);
      setDbLoaded(false);
    }

    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync to localStorage for guests
  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, wishlist }));
    }
  }, [items, wishlist, mounted, isLoggedIn]);

  // Sync cart to DB for logged-in users (debounced fire-and-forget)
  const syncCartToDb = useCallback((cartItems: CartItem[]) => {
    if (!isLoggedIn) return;
    fetch("/api/user/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    }).catch(() => {});
  }, [isLoggedIn]);

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
    }, 4000);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.variation === item.variation);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.productId === item.productId && i.variation === item.variation
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        next = [...prev, item];
      }
      syncCartToDb(next);
      return next;
    });
  }, [syncCartToDb]);

  const removeFromCart = useCallback((productId: string, variation?: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.productId === productId && i.variation === variation));
      if (isLoggedIn) {
        fetch(`/api/user/cart?productId=${encodeURIComponent(productId)}${variation ? `&variation=${encodeURIComponent(variation)}` : ""}`, {
          method: "DELETE",
        }).catch(() => {});
      }
      return next;
    });
  }, [isLoggedIn]);

  const updateQuantity = useCallback((productId: string, quantity: number, variation?: string) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const next = prev.filter((i) => !(i.productId === productId && i.variation === variation));
        if (isLoggedIn) {
          fetch(`/api/user/cart?productId=${encodeURIComponent(productId)}${variation ? `&variation=${encodeURIComponent(variation)}` : ""}`, {
            method: "DELETE",
          }).catch(() => {});
        }
        return next;
      });
      return;
    }
    setItems((prev) => {
      const next = prev.map((i) =>
        i.productId === productId && i.variation === variation ? { ...i, quantity } : i
      );
      syncCartToDb(next);
      return next;
    });
  }, [syncCartToDb, isLoggedIn]);

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

      // Sync to DB for logged-in users
      if (isLoggedIn) {
        fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        }).catch(() => {});
      }

      return isRemoving
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
  }, [showToast, isLoggedIn]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCredits(0);
    if (isLoggedIn) {
      fetch("/api/user/cart", { method: "DELETE" }).catch(() => {});
    }
  }, [isLoggedIn]);

  const creditDiscount = appliedCredits === 500 ? 10 : appliedCredits === 250 ? 5 : 0;

  const applyCredits = useCallback((amount: number) => {
    if (amount !== 250 && amount !== 500) return;
    if (!user || user.loyalty.currentCredits < amount) return;
    setAppliedCredits(amount);
  }, [user]);

  const removeCredits = useCallback(() => {
    setAppliedCredits(0);
  }, []);

  const checkout = useCallback((currency?: string) => {
    if (items.length === 0) return;
    const productIds = items.map((i) => i.productId);
    const cadSubtotal = items.reduce((sum, i) => sum + (i.cadPrice ?? i.price) * i.quantity, 0);

    let validCredits = appliedCredits;
    if (validCredits > 0) {
      if (!user || user.loyalty.currentCredits < validCredits) {
        validCredits = 0;
      }
    }

    const discount = validCredits === 500 ? 10 : validCredits === 250 ? 5 : 0;
    if (discount > cadSubtotal) {
      validCredits = 0;
    }
    const actualDiscount = validCredits === 500 ? 10 : validCredits === 250 ? 5 : 0;
    const finalCADTotal = Math.max(0, cadSubtotal - actualDiscount);

    if (validCredits > 0) {
      deductCredits(validCredits, `Redeemed ${validCredits} credits ($${actualDiscount} off)`);
    }

    const purchaseItems = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      unitPrice: Math.round((i.cadPrice ?? i.price) * 100),
      quantity: i.quantity,
      variation: i.variation,
      image: i.image,
    }));

    recordPurchase(productIds, finalCADTotal, currency, purchaseItems);
    setItems([]);
    setAppliedCredits(0);
    if (isLoggedIn) {
      fetch("/api/user/cart", { method: "DELETE" }).catch(() => {});
    }
  }, [items, appliedCredits, deductCredits, recordPurchase, user, isLoggedIn]);

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
