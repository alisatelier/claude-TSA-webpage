"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { calculateTier, type Tier } from "./loyalty-utils";

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
  referredByName: string | null;
  lockedCurrency: string | null;
}

export interface User {
  name: string;
  email: string;
  loyalty: LoyaltyState;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  tier: Tier;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, referralCode?: string, birthdayMonth?: number) => Promise<boolean>;
  logout: () => void;
  addCredits: (amount: number, action: string) => void;
  deductCredits: (amount: number, action: string) => Promise<boolean>;
  recordPurchase: (productIds: string[], totalSpent: number, currency?: string) => void;
  submitReview: (productId: string, rating: number, text: string) => Promise<boolean>;
  setBirthdayMonth: (month: number) => Promise<void>;
  claimBirthdayCredits: () => Promise<boolean>;
  refreshLoyalty: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultLoyalty: LoyaltyState = {
  currentCredits: 0,
  lifetimeCredits: 0,
  pointsHistory: [],
  referralCode: "",
  referralCount: 0,
  reviewedProducts: [],
  purchasedProducts: [],
  birthdayMonth: null,
  birthdayClaimed: null,
  joinDate: new Date().toISOString(),
  firstPurchaseCompleted: false,
  referredBy: null,
  referredByName: null,
  lockedCurrency: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyState>(defaultLoyalty);
  const [loyaltyLoaded, setLoyaltyLoaded] = useState(false);
  const migrationDone = useRef(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;
  const sessionUser = session?.user;

  const user: User | null = isLoggedIn && sessionUser
    ? {
        name: sessionUser.name || "",
        email: sessionUser.email || "",
        loyalty: loyaltyData,
      }
    : null;

  const tier = user ? calculateTier(user.loyalty.lifetimeCredits) : "Seeker";

  // Fetch loyalty data from API
  const fetchLoyalty = useCallback(async () => {
    try {
      const res = await fetch("/api/user/loyalty");
      if (res.ok) {
        const data = await res.json();
        setLoyaltyData({
          currentCredits: data.currentCredits,
          lifetimeCredits: data.lifetimeCredits,
          pointsHistory: data.pointsHistory,
          referralCode: data.referralCode,
          referralCount: data.referralCount,
          reviewedProducts: data.reviewedProducts,
          purchasedProducts: data.purchasedProducts,
          birthdayMonth: data.birthdayMonth,
          birthdayClaimed: data.birthdayClaimed,
          joinDate: data.joinDate,
          firstPurchaseCompleted: data.firstPurchaseCompleted,
          referredBy: data.referredBy,
          referredByName: data.referredByName ?? null,
          lockedCurrency: data.lockedCurrency,
        });
        setLoyaltyLoaded(true);
      }
    } catch {
      // silently fail
    }
  }, []);

  // Lazy migration from localStorage
  const migrateLocalStorage = useCallback(async () => {
    if (migrationDone.current) return;
    migrationDone.current = true;

    try {
      const usersRaw = localStorage.getItem("spirit-atelier-users");
      const reviewsRaw = localStorage.getItem("spirit-atelier-reviews");

      if (!usersRaw && !reviewsRaw) return;

      const users = usersRaw ? JSON.parse(usersRaw) : {};
      const email = sessionUser?.email;
      if (!email) return;

      const localUser = users[email];
      if (!localUser) return;

      const allReviews: UserReview[] = reviewsRaw ? JSON.parse(reviewsRaw) : [];
      const userReviews = allReviews.filter((r) => r.userEmail === email);

      await fetch("/api/user/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loyalty: localUser.loyalty,
          reviews: userReviews.map((r) => ({
            productId: r.productId,
            rating: r.rating,
            text: r.text,
            createdAt: r.createdAt,
          })),
        }),
      });

      // Clear localStorage keys
      localStorage.removeItem("spirit-atelier-users");
      localStorage.removeItem("spirit-atelier-reviews");
      localStorage.removeItem("spirit-atelier-auth");

      // Refresh loyalty data after migration
      await fetchLoyalty();
    } catch {
      // silently fail migration
    }
  }, [sessionUser?.email, fetchLoyalty]);

  // Load loyalty data when session becomes authenticated
  useEffect(() => {
    if (isLoggedIn) {
      fetchLoyalty().then(() => {
        migrateLocalStorage();
      });
    } else {
      setLoyaltyData(defaultLoyalty);
      setLoyaltyLoaded(false);
      migrationDone.current = false;
    }
  }, [isLoggedIn, fetchLoyalty, migrateLocalStorage]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return result?.ok ?? false;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    referralCode?: string,
    birthdayMonth?: number,
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode, birthdayMonth }),
      });

      if (!res.ok) return false;

      // Auto-login after registration
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      return loginResult?.ok ?? false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const addCredits = useCallback((amount: number, action: string) => {
    // Optimistic update
    setLoyaltyData((prev) => {
      const newCurrent = prev.currentCredits + amount;
      const newLifetime = prev.lifetimeCredits + amount;
      return {
        ...prev,
        currentCredits: newCurrent,
        lifetimeCredits: newLifetime,
        pointsHistory: [
          { date: new Date().toISOString(), action, credits: amount, runningBalance: newCurrent },
          ...prev.pointsHistory,
        ],
      };
    });

    // Fire-and-forget API call
    fetch("/api/user/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, action, type: "add" }),
    }).catch(() => {});
  }, []);

  const deductCredits = useCallback(async (amount: number, action: string): Promise<boolean> => {
    if (loyaltyData.currentCredits < amount || amount <= 0) return false;

    // Optimistic update
    setLoyaltyData((prev) => {
      const newCurrent = Math.max(0, prev.currentCredits - amount);
      return {
        ...prev,
        currentCredits: newCurrent,
        pointsHistory: [
          { date: new Date().toISOString(), action, credits: -amount, runningBalance: newCurrent },
          ...prev.pointsHistory,
        ],
      };
    });

    try {
      const res = await fetch("/api/user/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, action, type: "deduct" }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [loyaltyData.currentCredits]);

  const recordPurchase = useCallback((productIds: string[], totalSpent: number, currency?: string) => {
    const creditsEarned = Math.floor(totalSpent);

    // Optimistic update
    setLoyaltyData((prev) => {
      const newPurchased = [...new Set([...prev.purchasedProducts, ...productIds])];
      const newCurrent = prev.currentCredits + creditsEarned;
      const newLifetime = prev.lifetimeCredits + creditsEarned;
      const newLockedCurrency = prev.lockedCurrency ?? (currency || null);

      return {
        ...prev,
        currentCredits: newCurrent,
        lifetimeCredits: newLifetime,
        purchasedProducts: newPurchased,
        firstPurchaseCompleted: true,
        lockedCurrency: newLockedCurrency,
        pointsHistory: [
          {
            date: new Date().toISOString(),
            action: `Purchase ($${totalSpent.toFixed(2)})`,
            credits: creditsEarned,
            runningBalance: newCurrent,
          },
          ...prev.pointsHistory,
        ],
      };
    });

    // Fire-and-forget API call
    fetch("/api/user/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds, totalSpent, currency }),
    }).catch(() => {});
  }, []);

  const submitReview = useCallback(async (productId: string, rating: number, text: string): Promise<boolean> => {
    if (text.length < 100) return false;
    if (!loyaltyData.purchasedProducts.includes(productId)) return false;
    if (loyaltyData.reviewedProducts.includes(productId)) return false;

    try {
      const res = await fetch("/api/user/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, text }),
      });

      if (!res.ok) return false;

      // Update local state
      setLoyaltyData((prev) => {
        const reviewCredits = 100;
        const newCurrent = prev.currentCredits + reviewCredits;
        const newLifetime = prev.lifetimeCredits + reviewCredits;
        return {
          ...prev,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          reviewedProducts: [...prev.reviewedProducts, productId],
          pointsHistory: [
            {
              date: new Date().toISOString(),
              action: "Review submitted",
              credits: reviewCredits,
              runningBalance: newCurrent,
            },
            ...prev.pointsHistory,
          ],
        };
      });

      return true;
    } catch {
      return false;
    }
  }, [loyaltyData.purchasedProducts, loyaltyData.reviewedProducts]);

  const setBirthdayMonth = useCallback(async (month: number): Promise<void> => {
    setLoyaltyData((prev) => ({ ...prev, birthdayMonth: month }));

    await fetch("/api/user/birthday", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month }),
    }).catch(() => {});
  }, []);

  const claimBirthdayCredits = useCallback(async (): Promise<boolean> => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (loyaltyData.birthdayMonth !== currentMonth) return false;
    if (loyaltyData.birthdayClaimed === currentYear) return false;

    try {
      const res = await fetch("/api/user/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: true }),
      });

      if (!res.ok) return false;

      setLoyaltyData((prev) => {
        const bdayCredits = 150;
        const newCurrent = prev.currentCredits + bdayCredits;
        const newLifetime = prev.lifetimeCredits + bdayCredits;
        return {
          ...prev,
          currentCredits: newCurrent,
          lifetimeCredits: newLifetime,
          birthdayClaimed: currentYear,
          pointsHistory: [
            {
              date: now.toISOString(),
              action: "Birthday credits",
              credits: bdayCredits,
              runningBalance: newCurrent,
            },
            ...prev.pointsHistory,
          ],
        };
      });

      return true;
    } catch {
      return false;
    }
  }, [loyaltyData.birthdayMonth, loyaltyData.birthdayClaimed]);

  const mounted = status !== "loading" || loyaltyLoaded;

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
    refreshLoyalty: fetchLoyalty,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
