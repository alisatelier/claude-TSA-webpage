"use client";

import { useState, useTransition } from "react";
import { adjustStock } from "./actions";

export default function StockAdjustButton({
  productId,
  variation,
  currentStock,
}: {
  productId: string;
  variation: string;
  currentStock: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [adjustment, setAdjustment] = useState(0);

  const previewTotal = currentStock + adjustment;

  const handleSet = () => {
    if (adjustment === 0) return;
    startTransition(async () => {
      await adjustStock(productId, variation, previewTotal, true);
      setAdjustment(0);
      setOpen(false);
    });
  };

  const handleCancel = () => {
    setAdjustment(0);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
      >
        Adjust
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setAdjustment((a) => a - 1)}
        disabled={isPending || previewTotal <= 0}
        className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
      >
        -
      </button>
      <span className={`w-10 text-center text-sm font-medium ${adjustment !== 0 ? "text-blue-600" : ""}`}>
        {adjustment !== 0 ? (adjustment > 0 ? `+${adjustment}` : adjustment) : "0"}
      </span>
      <button
        onClick={() => setAdjustment((a) => a + 1)}
        disabled={isPending}
        className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 text-sm font-medium"
      >
        +
      </button>
      {adjustment !== 0 && (
        <span className="text-xs text-gray-400 ml-0.5">({previewTotal})</span>
      )}
      <button
        onClick={handleSet}
        disabled={isPending || adjustment === 0}
        className="px-2 py-1 bg-slate-800 text-white rounded text-xs hover:bg-slate-700 disabled:opacity-50"
      >
        Set
      </button>
      <button
        onClick={handleCancel}
        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
      >
        Cancel
      </button>
    </div>
  );
}
