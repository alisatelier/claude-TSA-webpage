"use client";

import { useTransition } from "react";
import { OrderStatus } from "@/lib/enums";
import { updateOrderStatus } from "./actions";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateOrderStatus(orderId, e.target.value as OrderStatus);
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
    >
      {Object.values(OrderStatus).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
