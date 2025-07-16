import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";

const GeneratorResult = ({ ipsumText, unit }) => {
  const handleCopyText = useCallback(() => {
    if (!ipsumText) {
      toast.error("No text to copy", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
      return;
    }
    navigator.clipboard
      .writeText(ipsumText)
      .then(() =>
        toast.success("Copied to clipboard", {
          position: "bottom-center",
          duration: 2000,
          icon: "📋",
        }),
      )
      .catch(() =>
        toast.error("Failed to copy text", {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        }),
      );
  }, [ipsumText]);

  const textCount = useMemo(() => {
    if (!ipsumText) return "";

    switch (unit) {
      case "words": {
        return `Words: ${ipsumText.split(/\s+/).length}`;
      }
      case "sentences": {
        return `Sentences: ${ipsumText.split(/[.!?]+/).filter(Boolean).length}`;
      }
      case "paragraphs": {
        return `Paragraphs: ${ipsumText.split(/\n{2,}/).filter(Boolean).length}`;
      }
      default: {
        return "";
      }
    }
  }, [ipsumText, unit]);

  if (!ipsumText) {
    return (
      <div className="card bg-base-100 shadow-xl mx-auto max-w-2xl mt-8">
        <div className="card-body items-center text-center p-8">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">Your Ipsum Awaits</h3>
          <p className="text-base-content/60 mb-4">
            Enter your keywords and generate custom Lorem Ipsum text.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mx-auto max-w-2xl mt-8">
      <div className="card-body p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Generated Text</h3>
          <div className="badge badge-ghost">{textCount}</div>
        </div>

        <div className="bg-base-200 rounded-box p-6 min-h-[200px] overflow-auto">
          <pre className="whitespace-pre-wrap break-words font-sans">
            {ipsumText}
          </pre>
        </div>

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleCopyText}
            disabled={!ipsumText}
            aria-label="Copy Ipsum text"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorResult;
