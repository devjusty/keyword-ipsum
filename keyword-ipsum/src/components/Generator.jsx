import { useState } from "react";
import { generateIpsum } from "./GeneratorLogic";

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("keyword ipsum");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("sentences");

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!keywords || isNaN(length) || length <= 0) {
      setError("Enter keywords and a positive number for length");
      setIpsumText("");
    } else {
      setError("");
      setIpsumText(
        generateIpsum(keywords.split(/[,\s]+/), parseInt(length), unit)
      );
    }
  };

  return (
    <div>
      <form
        className="form flex flex-row items-center justify-center gap-2 py-2 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="form-control max-w-xs text-black">
          <label className="label" htmlFor="keywords">
            <span className="label-text">Keywords</span>
          </label>
          <input
            type="text"
            placeholder="awesome, radical, sick"
            value={keywords}
            id="keywords"
            onChange={(e) => setKeywords(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control max-w-xs">
          <label className="label" htmlFor="length">
            <span className="label-text">Length</span>
          </label>
          <input
            type="number"
            id="length"
            min={1}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="input input-bordered w-full max-w-xs text-black"
          />
        </div>
        <div className="form-control max-w-xs">
          {" "}
          <label htmlFor="unit" className="label">
            <span className="label-text">Units</span>
          </label>
          <div className="join">
            <input
              className="join-item btn"
              type="radio"
              value="words"
              checked={unit === "words"}
              name="options"
              aria-label="Words"
              onChange={handleUnitChange}
            />
            <input
              className="join-item btn"
              type="radio"
              value="sentences"
              checked={unit === "sentences"}
              name="options"
              aria-label="Sentences"
              onChange={handleUnitChange}
            />
            <input
              className="join-item btn"
              type="radio"
              value="paragraphs"
              checked={unit === "paragraphs"}
              name="options"
              aria-label="Paragraphs"
              onChange={handleUnitChange}
            />
          </div>
        </div>

        <div className="form-control max-w-xs self-end">
          <button type="submit" className="btn btn-primary">
            Make My Ipsum
          </button>
        </div>
      </form>
      <div className="form-control w-full">
        <textarea
          className="textarea textarea-bordered text-black"
          placeholder={ipsumText}
        ></textarea>
      </div>
      <button className="btn btn-secondary">Copy My Ipsum</button>
      {error && <p>{error}</p>}
      {ipsumText && <p>{ipsumText}</p>}
    </div>
  );
};
export default Generator;
