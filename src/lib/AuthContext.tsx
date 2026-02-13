"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { calculateTier, type Tier } from "./loyalty-utils";

const STORAGE_KEY = "spirit-atelier-auth";
const REVIEWS_STORAGE_KEY = "spirit-atelier-reviews";

export interface UserReview {
  id: string;
  userEmail: string;
  userName: string;
  productId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface PointsHistoryEntry {
  date: string;
  action: string;
  credits: number;
  runningBalance: number;
}

export interface LoyaltyState {
  currentCredits: number;
  lifetimeCredits: number;
  pointsHistory: PointsHistoryEntry[];
  referralCode: string;
  referralCount: number;
  reviewedProducts: string[];
  purchasedProducts: string[];
  birthdayMonth: number | null;
  birthdayClaimed: number | null;
  joinDate: string;
  firstPurchaseCompleted: boolean;
  referredBy: string | null;
  lockedCurrency: string | null;
}

export interface User {
  name: string;
  email: string;
  loyalty: LoyaltyState;
}

interface StoredAuth {
  isLoggedIn: boolean;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  tier: Tier;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, referralCode?: string, birthdayMonth?: number) => boolean;
  logout: () => void;
  addCredits: (amount: number, action: string) => void;
  deductCredits: (amount: number, action: string) => boolean;
  recordPurchase: (productIds: string[], totalSpent: number, currency?: string) => void;
  submitReview: (productId: string, rating: number, text: string) => boolean;
  setBirthdayMonth: (month: number) => void;
  claimBirthdayCredits: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateReferralCode(name: string): string {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4) || "USER";
  const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `REF-${cleanName}-${hex}`;
}

function createDefaultLoyalty(referralCode: string, referredBy: string | null): LoyaltyState {
  return {
    currentCredits: 0,
    lifetimeCredits: 0,
    pointsHistory: [],
    referralCode,
    referralCount: 0,
    reviewedProducts: [],
    purchasedProducts: [],
    birthdayMonth: null,
    birthdayClaimed: null,
    joinDate: new Date().toISOString(),
    firstPurchaseCompleted: false,
    referredBy,
    lockedCurrency: null,
  };
}

function getAllUsers(): Record<string, User> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("spirit-atelier-users");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUser(user: User) {
  const users = getAllUsers();
  users[user.email] = user;
  localStorage.setItem("spirit-atelier-users", JSON.stringify(users));
}

function findUserByReferralCode(code: string): User | null {
  const users = getAllUsers();
  return Object.values(users).find((u) => u.loyalty.referralCode === code) || null;
}

function saveReview(review: UserReview) {
  const reviews = getUserReviews();
  reviews.push(review);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

export function getUserReviews(productId?: string): UserReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    const all: UserReview[] = raw ? JSON.parse(raw) : [];
    return productId ? all.filter((r) => r.productId === productId) : all;
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredAuth = JSON.parse(raw);
        if (stored.isLoggedIn && stored.user) {
          setUser(stored.user);
          setIsLoggedIn(true);
        }
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!mounted) return;
    if (isLoggedIn && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user }));
      saveUser(user);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: false, user: null }));
    }
  }, [user, isLoggedIn, mounted]);

  const tier = user ? calculateTier(user.loyalty.lifetimeCredits) : "Seeker";

  const addCredits = useCallback((amount: number, action: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newCurrent = prev.loyalty.currentCredits + amount;
      const newLifetime = prev.loyalty.lifetimeCredits + amount;
      const entry: PointsHistoryEntry = {
        date: new Date().toISOString(),
        action,
        credits: amount,
        runningBalance: newCurrent,
      };
      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          pointsHistory: [entry, ...prev.loyalty.pointsHistory],
        },
      };
    });
  }, []);

  const deductCredits = useCallback((amount: number, action: string): boolean => {
    let success = false;
    setUser((prev) => {
      if (!prev || prev.loyalty.currentCredits < amount || amount <= 0) return prev;
      success = true;
      const newCurrent = Math.max(0, prev.loyalty.currentCredits - amount);
      const entry: PointsHistoryEntry = {
        date: new Date().toISOString(),
        action,
        credits: -amount,
        runningBalance: newCurrent,
      };
      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          currentCredits: newCurrent,
          pointsHistory: [entry, ...prev.loyalty.pointsHistory],
        },
      };
    });
    return success;
  }, []);

  const login = useCallback((email: string, _password: string): boolean => {
    const users = getAllUsers();
    const existing = users[email];
    if (!existing) return false;
    setUser(existing);
    setIsLoggedIn(true);
    return true;
  }, []);

  const register = useCallback((name: string, email: string, _password: string, referralCode?: string, birthdayMonth?: number): boolean => {
    const users = getAllUsers();
    if (users[email]) return false;

    const code = generateReferralCode(name);
    const referredBy = referralCode || null;
    const loyalty = createDefaultLoyalty(code, referredBy);

    if (birthdayMonth && birthdayMonth >= 1 && birthdayMonth <= 12) {
      loyalty.birthdayMonth = birthdayMonth;
    }

    // Welcome credits
    const welcomeAmount = 50;
    loyalty.currentCredits += welcomeAmount;
    loyalty.lifetimeCredits += welcomeAmount;
    loyalty.pointsHistory.push({
      date: new Date().toISOString(),
      action: "Welcome bonus",
      credits: welcomeAmount,
      runningBalance: loyalty.currentCredits,
    });

    // Referral bonus for new user
    if (referralCode) {
      const referrer = findUserByReferralCode(referralCode);
      if (referrer) {
        const referralBonus = 200;
        loyalty.currentCredits += referralBonus;
        loyalty.lifetimeCredits += referralBonus;
        loyalty.pointsHistory.push({
          date: new Date().toISOString(),
          action: "Referral bonus (referred by friend)",
          credits: referralBonus,
          runningBalance: loyalty.currentCredits,
        });

        // Award referrer too
        const referrerBonus = 200;
        referrer.loyalty.currentCredits += referrerBonus;
        referrer.loyalty.lifetimeCredits += referrerBonus;
        referrer.loyalty.referralCount += 1;
        referrer.loyalty.pointsHistory = [
          {
            date: new Date().toISOString(),
            action: `Referral reward (${name} joined)`,
            credits: referrerBonus,
            runningBalance: referrer.loyalty.currentCredits,
          },
          ...referrer.loyalty.pointsHistory,
        ];
        saveUser(referrer);
      }
    }

    const newUser: User = { name, email, loyalty };
    saveUser(newUser);
    setUser(newUser);
    setIsLoggedIn(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const recordPurchase = useCallback((productIds: string[], totalSpent: number, currency?: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const creditsEarned = Math.floor(totalSpent);
      const newPurchased = [...new Set([...prev.loyalty.purchasedProducts, ...productIds])];
      const newCurrent = prev.loyalty.currentCredits + creditsEarned;
      const newLifetime = prev.loyalty.lifetimeCredits + creditsEarned;

      const entries: PointsHistoryEntry[] = [];
      entries.push({
        date: new Date().toISOString(),
        action: `Purchase ($${totalSpent.toFixed(2)})`,
        credits: creditsEarned,
        runningBalance: newCurrent,
      });

      // Lock currency on first purchase
      const newLockedCurrency = prev.loyalty.lockedCurrency ?? (currency || null);

      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          purchasedProducts: newPurchased,
          firstPurchaseCompleted: true,
          lockedCurrency: newLockedCurrency,
          pointsHistory: [...entries, ...prev.loyalty.pointsHistory],
        },
      };
    });
  }, []);

  const submitReview = useCallback((productId: string, rating: number, text: string): boolean => {
    if (text.length < 100) return false;
    let success = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (!prev.loyalty.purchasedProducts.includes(productId)) return prev;
      if (prev.loyalty.reviewedProducts.includes(productId)) return prev;
      success = true;
      const reviewCredits = 100;
      const newCurrent = prev.loyalty.currentCredits + reviewCredits;
      const newLifetime = prev.loyalty.lifetimeCredits + reviewCredits;
      const entry: PointsHistoryEntry = {
        date: new Date().toISOString(),
        action: "Review submitted",
        credits: reviewCredits,
        runningBalance: newCurrent,
      };
      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          reviewedProducts: [...prev.loyalty.reviewedProducts, productId],
          pointsHistory: [entry, ...prev.loyalty.pointsHistory],
        },
      };
    });

    // Store review in localStorage OUTSIDE the state updater
    // (React Strict Mode can call updaters twice, which would duplicate the side effect)
    if (success) {
      saveReview({
        id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userEmail: user?.email || "",
        userName: user?.name || "",
        productId,
        rating,
        text,
        createdAt: new Date().toISOString(),
      });
    }
    return success;
  }, [user]);

  const setBirthdayMonth = useCallback((month: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, loyalty: { ...prev.loyalty, birthdayMonth: month } };
    });
  }, []);

  const claimBirthdayCredits = useCallback((): boolean => {
    let success = false;
    setUser((prev) => {
      if (!prev) return prev;
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      if (prev.loyalty.birthdayMonth !== currentMonth) return prev;
      if (prev.loyalty.birthdayClaimed === currentYear) return prev;
      success = true;
      const bdayCredits = 150;
      const newCurrent = prev.loyalty.currentCredits + bdayCredits;
      const newLifetime = prev.loyalty.lifetimeCredits + bdayCredits;
      const entry: PointsHistoryEntry = {
        date: now.toISOString(),
        action: "Birthday credits",
        credits: bdayCredits,
        runningBalance: newCurrent,
      };
      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          birthdayClaimed: currentYear,
          pointsHistory: [entry, ...prev.loyalty.pointsHistory],
        },
      };
    });
    return success;
  }, []);

  // Prevent SSR mismatch — render children with default context until mounted
  const contextValue: AuthContextType = {
    user: mounted ? user : null,
    isLoggedIn: mounted ? isLoggedIn : false,
    tier,
    login,
    register,
    logout,
    addCredits,
    deductCredits,
    recordPurchase,
    submitReview,
    setBirthdayMonth,
    claimBirthdayCredits,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
