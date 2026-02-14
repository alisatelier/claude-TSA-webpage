"use client";

import { useState, useMemo, useCallback } from "react";
import { emailLayoutShell, BODY_PLACEHOLDER, fillPlaceholders } from "@/lib/email/layout";
import {
  sendCustomTestEmail,
  saveTemplateOverride,
  getTemplateHistory,
  getOverrideBody,
  type OverrideVersion,
} from "./actions";

interface EmailPreviewModalProps {
  templateId: string;
  templateName: string;
  defaultBody: string;
  savedBody?: string;
  defaultSubject: string;
  savedSubject?: string;
  variables: Record<string, string>;
  onClose: () => void;
}

export default function EmailPreviewModal({
  templateId,
  templateName,
  defaultBody,
  savedBody,
  defaultSubject,
  savedSubject,
  variables,
  onClose,
}: EmailPreviewModalProps) {
  const activeBody = savedBody ?? defaultBody;
  const activeSubject = savedSubject ?? defaultSubject;
  const [code, setCode] = useState(activeBody);
  const [subject, setSubject] = useState(activeSubject);
  const [showEditor, setShowEditor] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [versions, setVersions] = useState<OverrideVersion[] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSavedBody, setLastSavedBody] = useState(activeBody);
  const [lastSavedSubject, setLastSavedSubject] = useState(activeSubject);

  const shell = useMemo(() => emailLayoutShell(), []);

  // Fill {{placeholders}} with sample data for the preview, then wrap in layout
  const previewHtml = useMemo(() => {
    const filledBody = fillPlaceholders(code, variables);
    return shell.replace(BODY_PLACEHOLDER, filledBody);
  }, [shell, code, variables]);

  const filledSubjectPreview = useMemo(
    () => fillPlaceholders(subject, variables),
    [subject, variables]
  );

  const isModified = code !== lastSavedBody || subject !== lastSavedSubject;
  const hasOverride = savedBody !== undefined || lastSavedBody !== defaultBody || lastSavedSubject !== defaultSubject;

  const handleReset = useCallback(() => {
    setCode(defaultBody);
    setSubject(defaultSubject);
    setLastSavedBody(defaultBody);
    setLastSavedSubject(defaultSubject);
  }, [defaultBody, defaultSubject]);

  async function handleSend() {
    setSendStatus("sending");
    const result = await sendCustomTestEmail(templateName, code, variables, subject);
    setSendStatus(result.success ? "sent" : "failed");
    setTimeout(() => setSendStatus("idle"), 3000);
  }

  async function handleSave() {
    setSaveStatus("saving");
    const subjectToSave = subject !== defaultSubject ? subject : undefined;
    const result = await saveTemplateOverride(templateId, code, subjectToSave);
    if (result.success) {
      setLastSavedBody(code);
      setLastSavedSubject(subject);
      setSaveStatus("saved");
      setVersions(null);
    } else {
      setSaveStatus("failed");
    }
    setTimeout(() => setSaveStatus("idle"), 3000);
  }

  async function handleToggleHistory() {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    const result = await getTemplateHistory(templateId);
    if (result.versions) {
      setVersions(result.versions);
      setShowHistory(true);
    }
  }

  async function handleRestoreVersion(versionId: string) {
    const result = await getOverrideBody(versionId);
    if (result.body) {
      setCode(result.body);
    }
    if (result.subject) {
      setSubject(result.subject);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const sendLabel =
    sendStatus === "sending"
      ? "Sending..."
      : sendStatus === "sent"
        ? "Sent!"
        : sendStatus === "failed"
          ? "Failed"
          : "Send Test";

  const saveLabel =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved"
        ? "Saved!"
        : saveStatus === "failed"
          ? "Failed"
          : "Save";

  // Show available variable names above the editor
  const variableKeys = Object.keys(variables);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl mx-4 h-[75vh] flex flex-col transition-all ${
          showEditor ? "w-full max-w-6xl" : "w-full max-w-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{templateName}</h2>
            {hasOverride && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                Customised
              </span>
            )}
            {isModified && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                Unsaved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
            >
              {showEditor ? "Hide Code" : "Edit Code"}
            </button>
            {showEditor && (
              <button
                onClick={handleToggleHistory}
                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                  showHistory
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                History
              </button>
            )}
            {showEditor && hasOverride && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700"
              >
                Reset to Default
              </button>
            )}
            {showEditor && isModified && (
              <button
                onClick={handleSave}
                disabled={saveStatus !== "idle"}
                className={`px-3 py-1.5 text-sm rounded transition-colors text-white ${
                  saveStatus === "saved"
                    ? "bg-green-600"
                    : saveStatus === "failed"
                      ? "bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-70`}
              >
                {saveLabel}
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={sendStatus !== "idle"}
              className={`px-3 py-1.5 text-sm rounded transition-colors text-white ${
                sendStatus === "sent"
                  ? "bg-green-600"
                  : sendStatus === "failed"
                    ? "bg-red-600"
                    : "bg-slate-800 hover:bg-slate-700"
              } disabled:opacity-70`}
            >
              {sendLabel}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={`flex-1 min-h-0 overflow-hidden flex ${showEditor ? "divide-x divide-gray-200" : ""}`}>
          {showEditor && (
            <div className="w-1/2 flex flex-col min-h-0">
              {/* Subject editor */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded font-mono bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {subject !== defaultSubject && (
                  <button
                    onClick={() => setSubject(defaultSubject)}
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    Reset to default
                  </button>
                )}
              </div>

              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Body HTML
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      (header, footer &amp; unsubscribe are locked)
                    </span>
                  </div>
                </div>
                {variableKeys.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-xs text-gray-400">Variables:</span>
                    {variableKeys.map((key) => (
                      <code
                        key={key}
                        className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono"
                      >
                        {`{{${key}}}`}
                      </code>
                    ))}
                  </div>
                )}
              </div>

              {showHistory && versions && (
                <div className="border-b border-gray-200 bg-gray-50 max-h-48 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Version History
                    </span>
                  </div>
                  {versions.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-gray-400 italic">No saved versions yet.</p>
                  ) : (
                    <ul>
                      {versions.map((v, i) => (
                        <li
                          key={v.id}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                          <div>
                            <span className="text-xs text-gray-700">
                              {formatDate(v.createdAt)}
                            </span>
                            {i === 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-2">
                                Latest
                              </span>
                            )}
                            {v.hasSubjectOverride && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-1">
                                Subject
                              </span>
                            )}
                            <span className="text-xs text-gray-400 ml-2">{v.savedBy}</span>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(v.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Restore
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full p-4 font-mono text-xs leading-relaxed text-gray-800 bg-gray-50 resize-none focus:outline-none"
              />
            </div>
          )}
          <div className={showEditor ? "w-1/2 flex flex-col" : "w-full flex flex-col"}>
            {showEditor && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview</span>
                <p className="text-sm text-gray-700 mt-1 font-medium truncate">
                  {filledSubjectPreview}
                </p>
              </div>
            )}
            {!showEditor && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
                <span className="text-xs text-gray-400">Subject:</span>
                <span className="text-sm text-gray-700 ml-2 font-medium">{filledSubjectPreview}</span>
              </div>
            )}
            <iframe
              srcDoc={previewHtml}
              sandbox=""
              title={`Preview: ${templateName}`}
              className="w-full border-0 flex-1 min-h-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
