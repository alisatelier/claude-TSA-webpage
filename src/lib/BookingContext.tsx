"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

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
  createHold: (params: CreateHoldParams) => string | null;
  releaseHold: (holdId: string) => void;
  confirmBooking: (holdId: string) => BookingSession | null;
  getHoldById: (holdId: string) => BookingHold | null;
  isSlotTaken: (serviceId: string, date: string, time: string) => boolean;
  getActiveHold: () => BookingHold | null;
  getRemainingTime: (holdId: string) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

function loadHolds(): BookingHold[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HOLDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadBookings(): BookingSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function generateId(): string {
  return `hold-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [holds, setHolds] = useState<BookingHold[]>([]);
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const holdsRef = useRef(holds);
  holdsRef.current = holds;

  // Hydrate from localStorage
  useEffect(() => {
    const now = Date.now();
    const storedHolds = loadHolds().filter((h) => h.expiresAt > now);
    const storedBookings = loadBookings();
    setHolds(storedHolds);
    setBookings(storedBookings);
    setMounted(true);
  }, []);

  // Sync holds to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(HOLDS_STORAGE_KEY, JSON.stringify(holds));
  }, [holds, mounted]);

  // Sync bookings to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings, mounted]);

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
      const heldSlot = holds.some(
        (h) =>
          h.serviceId === serviceId &&
          h.selectedDate === date &&
          h.selectedTime === time &&
          h.expiresAt > now
      );
      if (heldSlot) return true;
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
    (params: CreateHoldParams): string | null => {
      const now = Date.now();
      // One-hold-per-user rule
      const existingActive = holdsRef.current.find((h) => h.expiresAt > now);
      if (existingActive) return null;

      // Check slot availability
      const slotHeld = holdsRef.current.some(
        (h) =>
          h.serviceId === params.serviceId &&
          h.selectedDate === params.selectedDate &&
          h.selectedTime === params.selectedTime &&
          h.expiresAt > now
      );
      if (slotHeld) return null;

      const slotBooked = bookings.some(
        (b) =>
          b.serviceId === params.serviceId &&
          b.selectedDate === params.selectedDate &&
          b.selectedTime === params.selectedTime
      );
      if (slotBooked) return null;

      const hold: BookingHold = {
        id: generateId(),
        serviceId: params.serviceId,
        selectedDate: params.selectedDate,
        selectedTime: params.selectedTime,
        expiresAt: now + HOLD_DURATION_MS,
        status: "held",
        userName: params.userName,
        userEmail: params.userEmail,
        userNotes: params.userNotes,
        addOn: params.addOn,
        totalPrice: params.totalPrice,
      };

      setHolds((prev) => [...prev, hold]);
      return hold.id;
    },
    [bookings]
  );

  const releaseHold = useCallback((holdId: string) => {
    setHolds((prev) => prev.filter((h) => h.id !== holdId));
  }, []);

  const confirmBooking = useCallback(
    (holdId: string): BookingSession | null => {
      const hold = holdsRef.current.find((h) => h.id === holdId);
      if (!hold) return null;
      if (hold.expiresAt <= Date.now()) return null;

      const session: BookingSession = {
        id: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        serviceId: hold.serviceId,
        selectedDate: hold.selectedDate,
        selectedTime: hold.selectedTime,
        status: "confirmed",
        userName: hold.userName,
        userEmail: hold.userEmail,
        userNotes: hold.userNotes,
        addOn: hold.addOn,
        totalPrice: hold.totalPrice,
        createdAt: new Date().toISOString(),
      };

      setHolds((prev) => prev.filter((h) => h.id !== holdId));
      setBookings((prev) => [...prev, session]);
      return session;
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
