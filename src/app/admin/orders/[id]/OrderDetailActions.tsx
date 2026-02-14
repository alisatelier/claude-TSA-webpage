"use client";

import { useState, useTransition } from "react";
import { OrderStatus } from "@/lib/enums";
import { updateOrderStatus, refundOrder } from "../actions";

export default function OrderDetailActions({
  orderId,
  currentStatus,
  totalAmount,
  refundAmount,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  totalAmount: number;
  refundAmount: number;
}) {
  const [confirming, setConfirming] = useState<
    "cancel" | "complete" | "refund" | null
  >(null);
  const [isPending, startTransition] = useTransition();

  // Refund state
  const [refundMode, setRefundMode] = useState<"$" | "%">("$");
  const [refundInput, setRefundInput] = useState("");
  const [refundError, setRefundError] = useState("");

  const isTerminal =
    currentStatus === "CANCELLED" || currentStatus === "COMPLETED";
  const remainingCents = totalAmount - refundAmount;
  const fullyRefunded = remainingCents <= 0;

  function handleAction(status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
      setConfirming(null);
    });
  }

  function computeRefundCents(): number {
    const val = parseFloat(refundInput);
    if (isNaN(val) || val <= 0) return 0;
    if (refundMode === "%") {
      return Math.round((val / 100) * totalAmount);
    }
    return Math.round(val * 100);
  }

  function handleRefundConfirm() {
    const cents = computeRefundCents();
    if (cents <= 0) {
      setRefundError("Enter a valid amount greater than zero");
      return;
    }
    if (cents > remainingCents) {
      setRefundError(
        `Exceeds remaining refundable amount ($${(remainingCents / 100).toFixed(2)})`
      );
      return;
    }
    setRefundError("");
    startTransition(async () => {
      try {
        await refundOrder(orderId, cents);
        setConfirming(null);
        setRefundInput("");
        setRefundMode("$");
      } catch (e) {
        setRefundError(e instanceof Error ? e.message : "Refund failed");
      }
    });
  }

  // Refund confirmation UI
  if (confirming === "refund") {
    const previewCents = computeRefundCents();
    const showPreview = refundMode === "%" && previewCents > 0;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex rounded overflow-hidden border border-gray-300">
            <button
              onClick={() => {
                setRefundMode("$");
                setRefundInput("");
                setRefundError("");
              }}
              className={`px-2.5 py-1 text-sm font-medium ${
                refundMode === "$"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              $
            </button>
            <button
              onClick={() => {
                setRefundMode("%");
                setRefundInput("");
                setRefundError("");
              }}
              className={`px-2.5 py-1 text-sm font-medium ${
                refundMode === "%"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              %
            </button>
          </div>
          <input
            type="number"
            value={refundInput}
            onChange={(e) => {
              setRefundInput(e.target.value);
              setRefundError("");
            }}
            step={refundMode === "$" ? "0.01" : "1"}
            min="0"
            max={refundMode === "%" ? "100" : undefined}
            placeholder={refundMode === "$" ? "0.00" : "0"}
            className="w-28 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          {showPreview && (
            <span className="text-sm text-gray-600">
              = ${(previewCents / 100).toFixed(2)}
            </span>
          )}
        </div>
        {refundError && (
          <p className="text-sm text-red-600">{refundError}</p>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefundConfirm}
            disabled={isPending}
            className="px-3 py-2 text-sm text-white bg-amber-600 rounded hover:bg-amber-700 disabled:opacity-50"
          >
            {isPending ? "Processing..." : "Confirm Refund"}
          </button>
          <button
            onClick={() => {
              setConfirming(null);
              setRefundInput("");
              setRefundError("");
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Cancel/Complete confirmation UI
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
      {!isTerminal && (
        <>
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
        </>
      )}
      <button
        onClick={() => setConfirming("refund")}
        disabled={fullyRefunded}
        className="px-3 py-2 text-sm text-amber-700 border border-amber-300 rounded hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {fullyRefunded ? "Fully Refunded" : "Refund"}
      </button>
    </div>
  );
}
