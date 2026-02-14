"use client";

import { useCallback } from "react";

interface OrderPdfData {
  orderNumber: number;
  status: string;
  totalAmount: number;
  refundAmount: number;
  trackingNumber: string | null;
  createdAt: string;
  customer: { name: string; email: string };
  items: {
    name: string;
    variation: string | null;
    quantity: number;
    unitPrice: number;
  }[];
}

function fmtOrderNum(n: number): string {
  if (n >= 1000000) return `#${n}`;
  return `#${String(n).padStart(6, "0")}`;
}

export default function OrderPdfButton({ order }: { order: OrderPdfData }) {
  const generate = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text("Order Summary", 14, y);
    y += 10;

    // Order number + status
    doc.setFontSize(11);
    doc.text(`Order: ${fmtOrderNum(order.orderNumber)}`, 14, y);
    doc.text(`Status: ${order.status}`, pageWidth - 14, y, { align: "right" });
    y += 7;

    // Date
    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Date: ${date}`, 14, y);
    y += 12;

    // Customer
    doc.setFontSize(12);
    doc.text("Customer", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(order.customer.name || "—", 14, y);
    y += 5;
    doc.text(order.customer.email, 14, y);
    y += 12;

    // Items table header
    doc.setFontSize(12);
    doc.text("Items", 14, y);
    y += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Product", 14, y);
    doc.text("Qty", 120, y, { align: "center" });
    doc.text("Unit Price", pageWidth - 14, y, { align: "right" });
    y += 2;
    doc.setDrawColor(200);
    doc.line(14, y, pageWidth - 14, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    for (const item of order.items) {
      const label = item.variation
        ? `${item.name} — ${item.variation}`
        : item.name;
      doc.text(label, 14, y);
      doc.text(String(item.quantity), 120, y, { align: "center" });
      doc.text(
        item.unitPrice > 0 ? `$${(item.unitPrice / 100).toFixed(2)}` : "—",
        pageWidth - 14,
        y,
        { align: "right" },
      );
      y += 6;
    }

    y += 4;
    doc.line(14, y, pageWidth - 14, y);
    y += 7;

    // Totals
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 100, y);
    doc.text(`$${(order.totalAmount / 100).toFixed(2)}`, pageWidth - 14, y, {
      align: "right",
    });
    y += 6;

    if (order.refundAmount > 0) {
      doc.setFont("helvetica", "normal");
      doc.text("Refunded:", 100, y);
      doc.text(
        `-$${(order.refundAmount / 100).toFixed(2)}`,
        pageWidth - 14,
        y,
        { align: "right" },
      );
      y += 6;

      doc.setFont("helvetica", "bold");
      const net = order.totalAmount - order.refundAmount;
      doc.text("Net Total:", 100, y);
      doc.text(`$${(net / 100).toFixed(2)}`, pageWidth - 14, y, {
        align: "right",
      });
      y += 6;
    }

    // Tracking
    if (order.trackingNumber) {
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Tracking: ${order.trackingNumber}`, 14, y);
    }

    doc.save(`order-${fmtOrderNum(order.orderNumber).replace("#", "")}.pdf`);
  }, [order]);

  return (
    <button
      onClick={generate}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Download PDF
    </button>
  );
}
