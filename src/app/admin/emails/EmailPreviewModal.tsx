"use client";

interface EmailPreviewModalProps {
  html: string;
  templateName: string;
  onClose: () => void;
}

export default function EmailPreviewModal({
  html,
  templateName,
  onClose,
}: EmailPreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{templateName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-hidden p-1">
          <iframe
            srcDoc={html}
            sandbox=""
            title={`Preview: ${templateName}`}
            className="w-full h-[70vh] border-0"
          />
        </div>
      </div>
    </div>
  );
}
