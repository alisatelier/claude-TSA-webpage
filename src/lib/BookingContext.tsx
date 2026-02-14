"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const HOLDS_STORAGE_KEY = "spirit-atelier-booking-holds";
const BOOKINGS_STORAGE_KEY = "spirit-atelier-bookings";
const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface BookingHold {
  id: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  expiresAt: number;
  status: "held";
  userName: string;
  userEmail: string;
  userNotes: string;
  addOn: boolean;
  totalPrice: number;
}

export interface BookingSession {
  id: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  status: "confirmed";
  userName: string;
  userEmail: string;
  userNotes: string;
  addOn: boolean;
  totalPrice: number;
  createdAt: string;
}

interface CreateHoldParams {
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  userName: string;
  userEmail: string;
  userNotes: string;
  addOn: boolean;
  totalPrice: number;
}

interface BookingContextType {
  holds: BookingHold[];
  bookings: BookingSession[];
  createHold: (params: CreateHoldParams) => Promise<string | null>;
  releaseHold: (holdId: string) => void;
  confirmBooking: (holdId: string) => Promise<BookingSession | null>;
  getHoldById: (holdId: string) => BookingHold | null;
  isSlotTaken: (serviceId: string, date: string, time: string) => boolean;
  getActiveHold: () => BookingHold | null;
  getRemainingTime: (holdId: string) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [holds, setHolds] = useState<BookingHold[]>([]);
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const holdsRef = useRef(holds);
  holdsRef.current = holds;
  const migrationDone = useRef(false);

  // Hydrate holds from local state (holds are always client-managed for UX)
  useEffect(() => {
    const now = Date.now();
    try {
      const raw = localStorage.getItem(HOLDS_STORAGE_KEY);
      const storedHolds: BookingHold[] = raw ? JSON.parse(raw) : [];
      setHolds(storedHolds.filter((h) => h.expiresAt > now));
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Migrate localStorage confirmed bookings to DB on first login
  useEffect(() => {
    if (!session?.user || migrationDone.current) return;
    migrationDone.current = true;

    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (!raw) return;
      const localBookings: BookingSession[] = JSON.parse(raw);
      if (localBookings.length === 0) return;

      fetch("/api/bookings/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookings: localBookings.map((b) => ({
            serviceId: b.serviceId,
            selectedDate: b.selectedDate,
            selectedTime: b.selectedTime,
            userName: b.userName,
            userEmail: b.userEmail,
            userNotes: b.userNotes,
            addOn: b.addOn,
            totalPrice: b.totalPrice,
            createdAt: b.createdAt,
          })),
        }),
      }).then(() => {
        localStorage.removeItem(BOOKINGS_STORAGE_KEY);
        setBookings([]);
      }).catch(() => {});
    } catch {
      // ignore
    }
  }, [session?.user]);

  // Sync holds to localStorage (client-side timer state)
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(HOLDS_STORAGE_KEY, JSON.stringify(holds));
  }, [holds, mounted]);

  // Cleanup expired holds every 10 seconds
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setHolds((prev) => {
        const active = prev.filter((h) => h.expiresAt > now);
        if (active.length !== prev.length) return active;
        return prev;
      });
    }, 10_000);
    return () => clearInterval(interval);
  }, [mounted]);

  const isSlotTaken = useCallback(
    (serviceId: string, date: string, time: string): boolean => {
      const now = Date.now();
      // Check local holds
      const heldSlot = holds.some(
        (h) =>
          h.serviceId === serviceId &&
          h.selectedDate === date &&
          h.selectedTime === time &&
          h.expiresAt > now
      );
      if (heldSlot) return true;

      // Check local bookings (for guest/cached)
      const bookedSlot = bookings.some(
        (b) =>
          b.serviceId === serviceId &&
          b.selectedDate === date &&
          b.selectedTime === time
      );
      return bookedSlot;
    },
    [holds, bookings]
  );

  const getActiveHold = useCallback((): BookingHold | null => {
    const now = Date.now();
    return holds.find((h) => h.expiresAt > now) ?? null;
  }, [holds]);

  const createHold = useCallback(
    async (params: CreateHoldParams): Promise<string | null> => {
      const now = Date.now();
      // One-hold-per-user rule (client-side check)
      const existingActive = holdsRef.current.find((h) => h.expiresAt > now);
      if (existingActive) return null;

      try {
        const res = await fetch("/api/bookings/hold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const hold: BookingHold = {
          id: data.holdId,
          serviceId: params.serviceId,
          selectedDate: params.selectedDate,
          selectedTime: params.selectedTime,
          expiresAt: data.expiresAt,
          status: "held",
          userName: params.userName,
          userEmail: params.userEmail,
          userNotes: params.userNotes,
          addOn: params.addOn,
          totalPrice: params.totalPrice,
        };

        setHolds((prev) => [...prev, hold]);
        return hold.id;
      } catch {
        return null;
      }
    },
    []
  );

  const releaseHold = useCallback((holdId: string) => {
    setHolds((prev) => prev.filter((h) => h.id !== holdId));

    // Release on server
    fetch(`/api/bookings/hold?holdId=${encodeURIComponent(holdId)}`, {
      method: "DELETE",
    }).catch(() => {});
  }, []);

  const confirmBooking = useCallback(
    async (holdId: string): Promise<BookingSession | null> => {
      const hold = holdsRef.current.find((h) => h.id === holdId);
      if (!hold) return null;
      if (hold.expiresAt <= Date.now()) return null;

      try {
        const res = await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ holdId }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const bookingSession: BookingSession = {
          id: data.bookingId,
          serviceId: hold.serviceId,
          selectedDate: hold.selectedDate,
          selectedTime: hold.selectedTime,
          status: "confirmed",
          userName: hold.userName,
          userEmail: hold.userEmail,
          userNotes: hold.userNotes,
          addOn: hold.addOn,
          totalPrice: hold.totalPrice,
          createdAt: data.createdAt,
        };

        setHolds((prev) => prev.filter((h) => h.id !== holdId));
        setBookings((prev) => [...prev, bookingSession]);
        return bookingSession;
      } catch {
        return null;
      }
    },
    []
  );

  const getHoldById = useCallback(
    (holdId: string): BookingHold | null => {
      return holds.find((h) => h.id === holdId) ?? null;
    },
    [holds]
  );

  const getRemainingTime = useCallback(
    (holdId: string): number => {
      const hold = holds.find((h) => h.id === holdId);
      if (!hold) return 0;
      const remaining = Math.max(0, hold.expiresAt - Date.now());
      return Math.ceil(remaining / 1000);
    },
    [holds]
  );

  return (
    <BookingContext.Provider
      value={{
        holds,
        bookings,
        createHold,
        releaseHold,
        confirmBooking,
        getHoldById,
        isSlotTaken,
        getActiveHold,
        getRemainingTime,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
