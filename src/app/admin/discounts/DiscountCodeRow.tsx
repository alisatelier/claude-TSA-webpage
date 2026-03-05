"use client";

import { useTransition } from "react";
import { toggleDiscountCode, deleteDiscountCode } from "./actions";

interface Props {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  usedCount: number;
  maxUses: number | null;
  maxUsesPerCustomer: number | null;
  active: boolean;
  expiresAt: string | null;
}

export default function DiscountCodeRow({ id, code, type, value, usedCount, maxUses, maxUsesPerCustomer, active, expiresAt }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleDiscountCode(id);
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete discount code "${code}"?`)) return;
    startTransition(async () => {
      await deleteDiscountCode(id);
    });
  };

  const isExpired = expiresAt && new Date(expiresAt) < new Date();

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{code}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {type === "PERCENTAGE" ? `${value}%` : `$${value.toFixed(2)}`}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {usedCount}{maxUses ? ` / ${maxUses}` : ""}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {maxUsesPerCustomer ?? "—"}
      </td>
      <td className="px-4 py-3 text-sm">
        {isExpired ? (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">Expired</span>
        ) : active ? (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
        ) : (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">Inactive</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {expiresAt ? new Date(expiresAt).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            {active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
