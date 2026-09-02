import { useMemo, useCallback } from "react";
import { CopyIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import { hasClipboardSupport } from "../utils/clipboard";

const GeneratorResult = ({ ipsumText, unit }) => {
  const handleCopyText = useCallback(async () => {
    if (!ipsumText) {
      toast.error("Nothing to copy yet.", {
        position: "bottom-center",
        duration: 2000,
      });
      return;
    }

    if (!hasClipboardSupport(globalThis.navigator)) {
      toast.error("Copying is unavailable in this browser.", {
        position: "bottom-center",
        duration: 2000,
      });
      return;
    }

    try {
      await globalThis.navigator.clipboard.writeText(ipsumText);
      toast.success("Copied to clipboard", {
        position: "bottom-center",
        duration: 2000,
      });
    } catch {
      toast.error("Unable to copy text. Select and copy it manually.", {
        position: "bottom-center",
        duration: 2000,
      });
    }
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
      <div className="workbench__output result-surface result-surface--empty">
        <p className="section-kicker">Generated passage</p>
        <h2>Create a passage</h2>
        <p>Add keywords to generate a passage.</p>
      </div>
    );
  }

  return (
    <div className="workbench__output result-surface result-surface--filled">
      <div className="result-heading">
        <div>
          <p className="section-kicker">Generated passage</p>
          <h2>Your generated text</h2>
        </div>
        <div className="result-count">{textCount}</div>
      </div>

      <div className="result-copy">
        <pre className="whitespace-pre-wrap wrap-break-word font-sans">
          {ipsumText}
        </pre>
      </div>

      <div className="result-actions">
        <button
          className="btn btn-ghost btn-sm whitespace-nowrap"
          onClick={handleCopyText}
          disabled={!ipsumText}
          aria-label="Copy generated text"
        >
          <CopyIcon aria-hidden="true" />
          Copy text
        </button>
      </div>
    </div>
  );
};

export default GeneratorResult;
