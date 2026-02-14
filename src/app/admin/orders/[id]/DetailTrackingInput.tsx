"use client";

import { useState, useTransition, useRef } from "react";
import { updateTrackingNumber } from "../actions";

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function save() {
    if (value === currentTracking) return;
    startTransition(async () => {
      await updateTrackingNumber(orderId, value);
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
  );
}
