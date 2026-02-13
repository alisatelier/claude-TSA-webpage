"use client";

import { useTransition } from "react";
import { OrderStatus } from "@/lib/enums";
import { exportOrderCsv } from "./actions";

export default function ExportCsvButton({
  filters,
}: {
  filters?: { q?: string; status?: OrderStatus };
}) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const csv = await exportOrderCsv(filters);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <button
      onClick={handleExport}
      disabled={isPending}
      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
    >
      {isPending ? "Exporting..." : "Export CSV"}
    </button>
  );
}
