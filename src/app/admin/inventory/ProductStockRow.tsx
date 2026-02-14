"use client";

import { useState } from "react";
import Image from "next/image";
import StockAdjustButton from "./StockAdjustButton";

interface StockEntry {
  variation: string;
  stock: number;
  image: string | null;
}

export default function ProductStockRow({
  productId,
  productName,
  productImage,
  totalStock,
  entries,
}: {
  productId: string;
  productName: string;
  productImage: string;
  totalStock: number;
  entries: StockEntry[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-2xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-gray-900 truncate">{productName}</h2>
          <p className="text-xs text-gray-500">
            {entries.length} variation{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          className={`text-sm font-medium px-2 py-0.5 rounded flex-shrink-0 ${
            totalStock === 0
              ? "bg-red-100 text-red-700"
              : totalStock <= 2
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {totalStock} in stock
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200">
          {entries.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500 text-center">
              No stock entries
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {entries.map((entry) => (
                <div
                  key={entry.variation}
                  className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50"
                >
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {entry.image ? (
                      <Image
                        src={entry.image}
                        alt={entry.variation}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {entry.variation === "_default" ? "Default" : entry.variation}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium w-8 text-center flex-shrink-0 ${
                      entry.stock === 0
                        ? "text-red-600"
                        : entry.stock <= 2
                        ? "text-yellow-600"
                        : "text-gray-700"
                    }`}
                  >
                    {entry.stock}
                  </span>
                  <div className="flex-shrink-0">
                    <StockAdjustButton
                      productId={productId}
                      variation={entry.variation}
                      currentStock={entry.stock}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
