"use client";

import { useState, useEffect } from "react";

interface BookingTimerProps {
  expiresAt: number;
  onExpire: () => void;
  variant: "banner" | "inline";
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function BookingTimer({ expiresAt, onExpire, variant }: BookingTimerProps) {
  const [remaining, setRemaining] = useState(() => {
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setRemaining(secs);
      if (secs <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isWarning = remaining <= 120 && remaining > 0;
  const isExpired = remaining <= 0;

  if (isExpired) return null;

  if (variant === "inline") {
    return (
      <span className={`text-xs font-medium ${isWarning ? "text-amber-600" : "text-mauve"}`}>
        Held: {formatTime(remaining)}
      </span>
    );
  }

  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm text-center transition-colors ${
        isWarning
          ? "bg-amber-50 border border-amber-200 text-amber-800"
          : "bg-cream border border-navy/10 text-navy/80"
      }`}
    >
      {isWarning ? (
        <p>
          Your held time expires soon — complete checkout to secure your booking.{" "}
          <span className="font-semibold">{formatTime(remaining)}</span>
        </p>
      ) : (
        <p>
          Your chosen time is gently held for you.{" "}
          <span className="font-semibold">{formatTime(remaining)}</span>
        </p>
      )}
    </div>
  );
}
