"use client";

import { useState, useTransition } from "react";
import { addDateBlock, removeDateBlock } from "./actions";

interface DateBlock {
  id: string;
  date: string | null;
  time: string | null;
  reason: string | null;
}

export default function DateBlockList({ blocks }: { blocks: DateBlock[] }) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = () => {
    if (!date) return;
    startTransition(async () => {
      await addDateBlock(date, time || null, reason || null);
      setDate("");
      setTime("");
      setReason("");
    });
  };

  const handleRemove = (blockId: string) => {
    startTransition(async () => {
      await removeDateBlock(blockId);
    });
  };

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      <div className="flex items-end gap-3 mb-4 flex-wrap">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Time (blank = full day)</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="">Full Day</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
            <option value="6:00 PM">6:00 PM</option>
            <option value="8:00 PM">8:00 PM</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Holiday"
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!date}
          className="px-4 py-1.5 bg-slate-800 text-white rounded text-sm hover:bg-slate-700 disabled:opacity-50"
        >
          Add Block
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-gray-500">No date-specific blocks.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Time</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Reason</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blocks.map((block) => (
              <tr key={block.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{block.date}</td>
                <td className="px-3 py-2">{block.time ?? "Full Day"}</td>
                <td className="px-3 py-2 text-gray-500">{block.reason ?? "—"}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleRemove(block.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
