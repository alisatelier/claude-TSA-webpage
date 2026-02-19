"use client";

import { useState, useTransition } from "react";
import { updateScheduleSettings } from "./actions";

interface Props {
  leadTimeDays: number;
  maxRangeDays: number;
  maxBookingsPerWeek: number;
}

export default function BookingWindowEditor({ leadTimeDays, maxRangeDays, maxBookingsPerWeek }: Props) {
  const [lead, setLead] = useState(leadTimeDays);
  const [max, setMax] = useState(maxRangeDays);
  const [maxPerWeek, setMaxPerWeek] = useState(maxBookingsPerWeek ?? 3);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const dirty = lead !== leadTimeDays || max !== maxRangeDays || maxPerWeek !== maxBookingsPerWeek;

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      await updateScheduleSettings(lead, max, maxPerWeek);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Time (days)
          </label>
          <input
            type="number"
            min={0}
            value={lead}
            onChange={(e) => setLead(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Customers must book at least this many days in advance
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Range (days)
          </label>
          <input
            type="number"
            min={1}
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Customers can book up to this many days into the future
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Bookings / Week
          </label>
          <input
            type="number"
            min={1}
            value={maxPerWeek}
            onChange={(e) => setMaxPerWeek(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Maximum number of bookings allowed per week
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending || !dirty}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Settings saved</span>
        )}
      </div>
    </div>
  );
}
