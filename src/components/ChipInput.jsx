import React, { useState } from 'react';
import { CircleX } from 'lucide-react';

function ChipInput({label = 'Keywords', name, value, onChange}) {
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState('');

  function removeChip(chipToRemove) {
    const updatedChips = value.filter((chip) => chip !== chipToRemove);
    onChange(updatedChips);
  }

  function handleKeyDown(event) {
    const trimmed = text.trim();

    if ((event.key === 'Enter' || event.key === ',') && trimmed) {
      event.preventDefault();

      if (value.includes(trimmed)) {
        setValidationError('Duplicate entry');
      } else {
        onChange([...value, trimmed]);
        setText('');
        setValidationError('');
      }
    }

    if (event.key === 'Backspace' && text === '') {
      onChange(value.slice(0, -1));
    }
  }

return (
  <div className="chip-input">
    <label htmlFor={name} className='label mb-1 mr-2'>
    <span className='label-text text-primary'>{label}</span></label>
    <div className="flex gap-2 items-center input input-bordered px-2 py-1 min-h-[2.5rem]">
      {value.map((chip, index) => (
        <div
          key={index}
          className="relative flex items-center bg-slate-800 text-white text-sm rounded-md pl-2.5 pr-6 py-0.5"
        >
          {chip}
          <button
            type="button"
            onClick={() => removeChip(chip)}
            className="absolute right-0.5 top-0.5 p-1 rounded-md hover:bg-white/10 active:bg-white/20"
            aria-label={`Remove ${chip}`}
          >
            <CircleX size={12} />
          </button>
        </div>
      ))}
      <input
        id={name}
        name={name}
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? "Type and press enter or comma" : ""}
        className="min-w-[8ch] flex-shrink bg-transparent outline-none text-sm text-white placeholder:text-gray-300"
      />
    </div>
    {validationError && (
      <div className="error-message">
        {validationError}
      </div>
    )}
  </div>
  );
}

export default ChipInput;
