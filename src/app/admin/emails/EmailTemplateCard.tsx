"use client";

import { useState } from "react";
import type { TemplateMeta } from "@/lib/email/templates";
import { getPreviewHtml, sendTestEmail } from "./actions";
import EmailPreviewModal from "./EmailPreviewModal";

export default function EmailTemplateCard({ template }: { template: TemplateMeta }) {
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function handlePreview() {
    const result = await getPreviewHtml(template.id);
    if (result.html) setPreviewHtml(result.html);
  }

  async function handleSend() {
    setSendStatus("sending");
    const result = await sendTestEmail(template.id);
    setSendStatus(result.success ? "sent" : "failed");
    setTimeout(() => setSendStatus("idle"), 3000);
  }

  const sendLabel =
    sendStatus === "sending"
      ? "Sending..."
      : sendStatus === "sent"
        ? "Sent!"
        : sendStatus === "failed"
          ? "Failed"
          : "Send Test";

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{template.description}</p>
        <p className="text-xs text-gray-400 italic mb-4">{template.trigger}</p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={handlePreview}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
          >
            Preview
          </button>
          <button
            onClick={handleSend}
            disabled={sendStatus !== "idle"}
            className={`flex-1 px-3 py-2 text-sm rounded transition-colors text-white ${
              sendStatus === "sent"
                ? "bg-green-600"
                : sendStatus === "failed"
                  ? "bg-red-600"
                  : "bg-slate-800 hover:bg-slate-700"
            } disabled:opacity-70`}
          >
            {sendLabel}
          </button>
        </div>
      </div>

      {previewHtml && (
        <EmailPreviewModal
          html={previewHtml}
          templateName={template.name}
          onClose={() => setPreviewHtml(null)}
        />
      )}
    </>
  );
}
