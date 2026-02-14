"use client";

import { useState, useTransition } from "react";
import { OrderStatus } from "@/lib/enums";
import { updateOrderStatus } from "../actions";

export default function OrderDetailActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [confirming, setConfirming] = useState<"cancel" | "complete" | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const isTerminal =
    currentStatus === "CANCELLED" || currentStatus === "COMPLETED";

  if (isTerminal) return null;

  function handleAction(status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
      setConfirming(null);
    });
  }

  if (confirming) {
    const label = confirming === "cancel" ? "Cancel Order" : "Complete Order";
    const status: OrderStatus =
      confirming === "cancel" ? "CANCELLED" : "COMPLETED";
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{label}?</span>
        <button
          onClick={() => handleAction(status)}
          disabled={isPending}
          className={`px-3 py-2 text-sm text-white rounded disabled:opacity-50 ${
            confirming === "cancel"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Saving..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(null)}
          className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setConfirming("complete")}
        className="px-3 py-2 text-sm text-green-700 border border-green-300 rounded hover:bg-green-50"
      >
        Complete Order
      </button>
      <button
        onClick={() => setConfirming("cancel")}
        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
      >
        Cancel Order
      </button>
    </div>
  );
}
