"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative border-b border-cream/40 overflow-hidden">
      {/* Base Gradient (matching button style) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FEDDE8]/50 via-[#F2E9E9] to-[#FEDDE8]/50" />

      {/* Champagne Sweep */}
      <div
  className="absolute top-0 left-0 h-full w-[220%] pointer-events-none champagne-sweep
  bg-[linear-gradient(110deg,transparent,rgba(242,201,210,0.0),rgba(242,201,210,0.35),rgba(242,201,210,0.6),rgba(242,201,210,0.35),rgba(242,201,210,0.0),transparent)]"
/>


      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left py-3 px-6 gap-1 sm:gap-4 text-xs sm:text-sm tracking-wide">
        <span className="font-accent italic text-navy/80">
          ✨ Earn Ritual Credits ✨
        </span>

        <span className="hidden sm:inline text-mauve/50">—</span>

        <Link
          href="/loyalty"
          className="font-semibold text-navy tracking-wider uppercase transition-colors duration-300 hover:text-navy/80"
        >
          250 Credits = $5 Off
        </Link>

        <span className="hidden sm:inline text-mauve/50">—</span>

        <span className="font-accent italic text-navy/80">
          ✨ Join Our Loyalty Program ✨
        </span>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 sm:top-1/2 sm:-translate-y-1/2 text-mauve/60 hover:text-navy transition-colors text-sm"
        aria-label="Dismiss announcement"
      >
        ✕
      </button>
    </div>
  );
}
