"use client";

import { useState, useTransition } from "react";
import { approveReview, rejectReview, addResponse } from "./actions";

export default function ReviewActions({
  reviewId,
  isApproved,
  existingResponse,
}: {
  reviewId: string;
  isApproved: boolean;
  existingResponse: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState(existingResponse ?? "");
  const [confirmReject, setConfirmReject] = useState(false);

  const handleApprove = (withResponse?: boolean) => {
    startTransition(async () => {
      await approveReview(reviewId, withResponse ? responseText : undefined);
      setShowResponse(false);
    });
  };

  const handleReject = () => {
    if (!confirmReject) {
      setConfirmReject(true);
      return;
    }
    startTransition(async () => {
      await rejectReview(reviewId);
      setConfirmReject(false);
    });
  };

  const handleAddResponse = () => {
    if (!responseText.trim()) return;
    startTransition(async () => {
      await addResponse(reviewId, responseText);
      setShowResponse(false);
    });
  };

  return (
    <div className={`space-y-2 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2">
        {!isApproved && (
          <button
            onClick={() => handleApprove(false)}
            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => setShowResponse(!showResponse)}
          className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-700"
        >
          {existingResponse ? "Edit Response" : "Add Response"}
        </button>
        {!isApproved && (
          <button
            onClick={handleReject}
            className={`px-3 py-1 rounded text-xs font-medium ${
              confirmReject
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            {confirmReject ? "Confirm Delete" : "Reject"}
          </button>
        )}
        {confirmReject && (
          <button
            onClick={() => setConfirmReject(false)}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {showResponse && (
        <div className="space-y-2">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
            placeholder="Write your response..."
          />
          <div className="flex items-center gap-2">
            {isApproved ? (
              <button
                onClick={handleAddResponse}
                className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-700"
              >
                Save Response
              </button>
            ) : (
              <button
                onClick={() => handleApprove(true)}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
              >
                Approve with Response
              </button>
            )}
            <button
              onClick={() => setShowResponse(false)}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
