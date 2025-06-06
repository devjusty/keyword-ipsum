import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

function ChipInput({
  label = "Keywords",
  name,
  value = [],
  onChange,
  placeholder = "Type and press Enter",
  maxChips = 10,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputReference = useRef(null);

  // Focus the input when the component mounts or when chips change
  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, [value]);

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

    // Add chip on Enter, Comma, Tab, or Space
    if (
      (event.key === "Enter" ||
        event.key === "," ||
        event.key === "Tab" ||
        event.key === " ") &&
      trimmed
    ) {
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
    const chips = pastedText
      .split(/[,\s]+/)
      .map((chip) => chip.trim())
      .filter(
        (chip) => chip && !value.includes(chip) && value.length < maxChips,
      );

    if (chips.length > 0) {
      onChange([...value, ...chips]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text font-medium mb-2 text-accent">
            {label}
          </span>
          {value.length > 0 && (
            <span className="label-text-alt text-sm">
              {value.length}/{maxChips}
            </span>
          )}
        </label>
      )}

      <div
        className={`w-full flex flex-wrap gap-2 items-center input input-bordered p-2 min-h-12 ${isFocused ? "ring-2 ring-primary/50" : ""}`}
        onClick={() => inputReference.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.currentTarget.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {value.map((chip, index) => (
          <div
            key={index}
            className="badge badge-lg gap-1 bg-primary/10 text-primary border-0 pl-3 pr-1 py-2 hover:bg-primary/20 transition-colors duration-200"
          >
            <span className="max-w-[120px] truncate" title={chip}>
              {chip}
            </span>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeChip(chip);
              }}
              className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              aria-label={`Remove ${chip}`}
            >
              <X size={14} />
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm"
            placeholder={value.length === 0 ? placeholder : ""}
            aria-label="Add a keyword"
          />
        ) : (
          <span className="text-sm text-base-content/60">
            Maximum {maxChips} keywords reached
          </span>
        )}
        {value.length > 0 && (
          <button type="button" onClick={() => onChange([])} className="label">
            Clear
          </button>
        )}
      </div>

      <div className="label">
        <span className="label-text-alt mt-2 text-xs text-base-content/60">
          Press enter or comma to add keywords
        </span>
      </div>
    </div>
  );
}

export default React.memo(ChipInput);
