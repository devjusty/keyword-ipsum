import React, { useState, useRef, useEffect } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { shouldCommitChip } from "../utils/chipInputLogic";

function ChipInput({
  label = "Keywords",
  name,
  value = [],
  onChange,
  placeholder = "Type a keyword",
  maxChips = 10,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputReference = useRef(null);

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, []);

  const addChip = (chipText) => {
    const trimmed = chipText.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxChips) return;

    onChange([...value, trimmed]);
    setInputValue("");
  };

  const removeChip = (chipToRemove) => {
    onChange(value.filter((chip) => chip !== chipToRemove));
  };

  const handleKeyDown = (event) => {
    const trimmed = inputValue.trim();

    // Keep spaces available for multi-word keywords.
    if (shouldCommitChip(event.key, inputValue)) {
      event.preventDefault();
      addChip(trimmed);
    }

    // Remove last chip on Backspace when input is empty
    if (event.key === "Backspace" && !inputValue && value.length > 0) {
      event.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain");
    const candidates = pastedText
      .split(/[,\s]+/)
      .map((chip) => chip.trim())
      .filter(Boolean);

    if (candidates.length === 0 || value.length >= maxChips) return;

    const existingChips = new Set(value);
    const availableSlots = maxChips - value.length;
    const chipsToAdd = [];

    for (const candidate of candidates) {
      if (chipsToAdd.length >= availableSlots) break;
      if (existingChips.has(candidate)) continue;
      existingChips.add(candidate);
      chipsToAdd.push(candidate);
    }

    if (chipsToAdd.length > 0) {
      onChange([...value, ...chipsToAdd]);
    }
  };

  return (
    <div className="chip-field">
      {label && (
        <label htmlFor={name} className="chip-field__label">
          <span>{label}</span>
          {value.length > 0 && (
            <span className="chip-field__count">
              {value.length}/{maxChips}
            </span>
          )}
        </label>
      )}

      <div className="chip-field__control input input-bordered">
        {value.map((chip) => (
          <div key={chip} className="keyword-chip">
            <span className="max-w-30 truncate" title={chip}>
              {chip}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeChip(chip);
              }}
              className="keyword-chip__remove"
              aria-label={`Remove ${chip}`}
            >
              <Cross1Icon width="12" height="12" aria-hidden="true" />
            </button>
          </div>
        ))}

        {value.length < maxChips ? (
          <input
            ref={inputReference}
            type="text"
            id={name}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="chip-field__input"
            placeholder={value.length === 0 ? placeholder : ""}
            aria-label="Add a keyword"
          />
        ) : (
          <span className="chip-field__limit">
            Maximum {maxChips} keywords reached
          </span>
        )}
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="chip-field__clear"
          >
            Clear
          </button>
        )}
      </div>

      <div className="chip-field__helper">
        <span>Press Enter, comma, or Tab to add a keyword.</span>
      </div>
    </div>
  );
}

export default React.memo(ChipInput);
