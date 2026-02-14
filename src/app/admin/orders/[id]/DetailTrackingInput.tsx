"use client";

import { useState, useTransition, useRef } from "react";
import { updateTrackingNumber } from "../actions";

function detectCarrier(trackingNumber: string): string {
  const tn = trackingNumber.trim().toUpperCase();
  if (/^1Z/.test(tn)) return "UPS";
  if (/^(94|92|93|42)\d{18,20}$/.test(tn)) return "USPS";
  if (/^\d{12,15}$/.test(tn)) return "FedEx";
  if (/^[A-Z0-9]{13}$/.test(tn) || /^[A-Z0-9]{16}$/.test(tn)) return "Canada Post";
  return "Parcel Tracker";
}

function getTrackingUrl(trackingNumber: string): string {
  const tn = trackingNumber.trim();
  const carrier = detectCarrier(tn);
  switch (carrier) {
    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`;
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`;
    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`;
    case "Canada Post":
      return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodeURIComponent(tn)}`;
    default:
      return `https://parcelsapp.com/en/tracking/${encodeURIComponent(tn)}`;
  }
}

export default function DetailTrackingInput({
  orderId,
  currentTracking,
}: {
  orderId: string;
  currentTracking: string;
}) {
  const [value, setValue] = useState(currentTracking);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(currentTracking);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function save() {
    if (value === currentTracking) return;
    startTransition(async () => {
      await updateTrackingNumber(orderId, value);
      setLastSaved(value);
      setSaved(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
          placeholder="Scan or enter tracking number..."
          disabled={isPending}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
        <button
          onClick={save}
          disabled={isPending || value === currentTracking}
          className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">Saved</span>
        )}
      </div>
      {lastSaved && (
        <a
          href={getTrackingUrl(lastSaved)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span className="font-medium">{detectCarrier(lastSaved)}</span>
          <span className="text-blue-500">{lastSaved}</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
