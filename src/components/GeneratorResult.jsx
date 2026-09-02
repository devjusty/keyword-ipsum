import { useMemo, useCallback } from "react";
import { CopyIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

const GeneratorResult = ({ ipsumText, unit }) => {
  const handleCopyText = useCallback(() => {
    if (!ipsumText) {
      toast.error("No text to copy", {
        position: "bottom-center",
        duration: 2000,
      });
      return;
    }
    navigator.clipboard
      .writeText(ipsumText)
      .then(() =>
        toast.success("Copied to clipboard", {
          position: "bottom-center",
          duration: 2000,
        }),
      )
      .catch(() =>
        toast.error("Failed to copy text", {
          position: "bottom-center",
          duration: 2000,
        }),
      );
  }, [ipsumText]);

  const textCount = useMemo(() => {
    if (!ipsumText) return "";

    switch (unit) {
      case "words": {
        const normalized = ipsumText.trim();
        const tokens = normalized
          ? normalized.split(/\s+/).filter(Boolean)
          : [];
        return `Words: ${tokens.length}`;
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
      <div className="workbench__output result-surface mx-auto w-full max-w-2xl bg-base-200 p-8 text-center">
        <div className="text-lg font-medium mb-2">Build your first passage</div>
        <p className="text-base-content/60">
          Add keywords, then generate text.
        </p>
      </div>
    );
  }

  return (
    <div className="workbench__output result-surface mx-auto w-full max-w-2xl bg-base-100 p-6 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Generated Text</h3>
        <div className="badge badge-ghost">{textCount}</div>
      </div>

      <div className="bg-base-200 rounded-box p-6 min-h-50 overflow-auto">
        <pre className="whitespace-pre-wrap wrap-break-word font-sans">
          {ipsumText}
        </pre>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="btn btn-primary btn-outline btn-sm whitespace-nowrap"
          onClick={handleCopyText}
          disabled={!ipsumText}
          aria-label="Copy Ipsum text"
        >
          <CopyIcon aria-hidden="true" />
          Copy text
        </button>
      </div>
    </div>
  );
};

export default GeneratorResult;
