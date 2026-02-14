"use client";

import { useState, useTransition } from "react";
import { adjustCredits } from "../actions";

export default function CreditAdjustForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error?: boolean }>({
    text: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const amount = parseInt(formData.get("amount") as string, 10);
    const reason = formData.get("reason") as string;

    if (!amount || !reason) return;

    startTransition(async () => {
      try {
        await adjustCredits(userId, amount, reason);
        setMessage({ text: "Credits adjusted successfully" });
        form.reset();
      } catch (err) {
        setMessage({
          text: err instanceof Error ? err.message : "Failed to adjust credits",
          error: true,
        });
      }
      setTimeout(() => setMessage({ text: "" }), 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Amount</label>
        <input
          name="amount"
          type="number"
          required
          placeholder="+10 or -5"
          className="px-3 py-2 border border-gray-300 rounded text-sm w-28"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm text-gray-600 mb-1">Reason</label>
        <input
          name="reason"
          type="text"
          required
          placeholder="Reason for adjustment"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-slate-800 text-white rounded text-sm hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Adjust"}
      </button>
      {message.text && (
        <span
          className={`text-sm font-medium ${message.error ? "text-red-600" : "text-green-600"}`}
        >
          {message.text}
        </span>
      )}
    </form>
  );
}
