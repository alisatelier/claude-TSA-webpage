"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative border-b border-mauve/20 overflow-hidden">
      
      {/* Luminous Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#A69FA5] via-[#F2E9E9] to-[#A69FA5]" />

      {/* Soft shimmer sweep */}
      <div
        className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)]
        animate-[shimmer_8s_linear_infinite] opacity-40 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left py-3 px-6 gap-1 sm:gap-3 text-xs sm:text-sm tracking-wide">
        
        <span className="font-accent italic text-navy/80">
          ✨ Earn Ritual Credits ✨
        </span>

        <span className="hidden sm:inline text-mauve/50">—</span>

        <Link
          href="/loyalty"
          className="group relative font-medium text-navy transition-all duration-300"
        >
          <span className="relative z-10">
            250 Ritual Credits = $10 Off
          </span>
          <span className="absolute left-0 bottom-0 w-full h-[1px] bg-mauve/40 group-hover:bg-navy transition-colors duration-300" />
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
