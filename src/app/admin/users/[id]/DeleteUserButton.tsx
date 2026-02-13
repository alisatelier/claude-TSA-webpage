"use client";

import { useState, useTransition } from "react";
import { deleteUser } from "../actions";

export default function DeleteUserButton({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
      >
        Delete User
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-red-600">
        Delete {userEmail}?
      </span>
      <button
        onClick={() =>
          startTransition(async () => {
            await deleteUser(userId);
          })
        }
        disabled={isPending}
        className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Confirm"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}
