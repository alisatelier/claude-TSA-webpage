"use client";

import { useTransition } from "react";
import { toggleRecurringBlock } from "./actions";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOTS = ["12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];

interface RecurringBlock {
  id: string;
  dayOfWeek: number;
  time: string | null;
}

export default function WeeklyScheduleEditor({
  blocks,
}: {
  blocks: RecurringBlock[];
}) {
  const [isPending, startTransition] = useTransition();

  const isFullDayBlocked = (day: number) =>
    blocks.some((b) => b.dayOfWeek === day && b.time === null);

  const isSlotBlocked = (day: number, time: string) =>
    isFullDayBlocked(day) || blocks.some((b) => b.dayOfWeek === day && b.time === time);

  const handleToggle = (day: number, time: string | null) => {
    startTransition(async () => {
      await toggleRecurringBlock(day, time);
    });
  };

  return (
    <div className={`overflow-x-auto ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left px-3 py-2 font-medium text-gray-600 w-24">Day</th>
            <th className="text-center px-3 py-2 font-medium text-gray-600 w-16">All Day</th>
            {SLOTS.map((slot) => (
              <th key={slot} className="text-center px-3 py-2 font-medium text-gray-600">
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {DAYS.map((day, i) => {
            const dayBlocked = isFullDayBlocked(i);
            return (
              <tr key={day} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800">{day}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleToggle(i, null)}
                    className={`w-8 h-8 rounded text-xs font-medium ${
                      dayBlocked
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                    }`}
                  >
                    {dayBlocked ? "Off" : "On"}
                  </button>
                </td>
                {SLOTS.map((slot) => {
                  const blocked = isSlotBlocked(i, slot);
                  return (
                    <td key={slot} className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleToggle(i, slot)}
                        disabled={dayBlocked}
                        className={`w-8 h-8 rounded text-xs font-medium ${
                          dayBlocked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : blocked
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                      >
                        {blocked ? "Off" : "On"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
