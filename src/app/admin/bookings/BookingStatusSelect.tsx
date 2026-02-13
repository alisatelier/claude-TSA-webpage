"use client";

import { useTransition } from "react";
import { BookingStatus } from "@/lib/enums";
import { updateBookingStatus } from "./actions";

export default function BookingStatusSelect({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, e.target.value as BookingStatus);
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
    >
      {Object.values(BookingStatus).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
