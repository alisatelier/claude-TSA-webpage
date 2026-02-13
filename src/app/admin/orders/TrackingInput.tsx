"use client";

import { useState, useTransition } from "react";
import { updateTrackingNumber } from "./actions";

export default function TrackingInput({
  orderId,
  currentTracking,
}: {
  orderId: string;
  currentTracking: string;
}) {
  const [value, setValue] = useState(currentTracking);
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (value !== currentTracking) {
      startTransition(async () => {
        await updateTrackingNumber(orderId, value);
      });
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="Add tracking..."
      disabled={isPending}
      className="text-xs border border-gray-300 rounded px-2 py-1 w-32 disabled:opacity-50"
    />
  );
}
