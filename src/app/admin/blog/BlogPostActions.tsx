"use client";

import { useState, useTransition } from "react";
import { deleteBlogPost, toggleFeatured, moveBlogPost } from "./actions";

export default function BlogPostActions({
  postId,
  isFeatured,
  isFirst,
  isLast,
}: {
  postId: string;
  isFeatured: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggleFeatured = () => {
    startTransition(async () => {
      await toggleFeatured(postId, !isFeatured);
    });
  };

  const handleMove = (direction: "up" | "down") => {
    startTransition(async () => {
      await moveBlogPost(postId, direction);
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      await deleteBlogPost(postId);
      setConfirmDelete(false);
    });
  };

  return (
    <div className={`flex items-center gap-2 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-0.5 mr-1">
        <button
          onClick={() => handleMove("up")}
          disabled={isFirst}
          className="px-1.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={() => handleMove("down")}
          disabled={isLast}
          className="px-1.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          ▼
        </button>
      </div>
      <button
        onClick={handleToggleFeatured}
        className={`px-3 py-1 rounded text-xs font-medium ${
          isFeatured
            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        title={isFeatured ? "Remove featured" : "Set as featured"}
      >
        {isFeatured ? "★ Featured" : "☆ Feature"}
      </button>
      <button
        onClick={handleDelete}
        className={`px-3 py-1 rounded text-xs font-medium ${
          confirmDelete
            ? "bg-red-600 text-white"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`}
      >
        {confirmDelete ? "Confirm Delete" : "Delete"}
      </button>
      {confirmDelete && (
        <button
          onClick={() => setConfirmDelete(false)}
          className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
