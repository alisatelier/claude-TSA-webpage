"use client";

import { useState } from "react";
import type { TemplateMeta } from "@/lib/email/templates";
import { getPreviewHtml, sendTestEmail } from "./actions";
import EmailPreviewModal from "./EmailPreviewModal";

interface TestUser {
  id: string;
  name: string | null;
  email: string;
}

interface PreviewData {
  defaultBody: string;
  savedBody?: string;
  defaultSubject: string;
  savedSubject?: string;
  variables: Record<string, string>;
}

export default function EmailTemplateCard({
  template,
  testUsers,
}: {
  template: TemplateMeta;
  testUsers: TestUser[];
}) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [selectedUserId, setSelectedUserId] = useState("");

  async function handlePreview() {
    const result = await getPreviewHtml(template.id, selectedUserId || undefined);
    if (result.defaultBody && result.variables && result.defaultSubject) {
      setPreview({
        defaultBody: result.defaultBody,
        savedBody: result.savedBody,
        defaultSubject: result.defaultSubject,
        savedSubject: result.savedSubject,
        variables: result.variables,
      });
    }
  }

  async function handleSend() {
    setSendStatus("sending");
    const result = await sendTestEmail(template.id, selectedUserId || undefined);
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

        {testUsers.length > 0 && (
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full mb-3 px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">Sample Data (Sophia)</option>
            {testUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ?? "Unnamed"} ({u.email})
              </option>
            ))}
          </select>
        )}

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

      {preview && (
        <EmailPreviewModal
          templateId={template.id}
          templateName={template.name}
          defaultBody={preview.defaultBody}
          savedBody={preview.savedBody}
          defaultSubject={preview.defaultSubject}
          savedSubject={preview.savedSubject}
          variables={preview.variables}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
