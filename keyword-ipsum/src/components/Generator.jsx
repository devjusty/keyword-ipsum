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
        className="form py-4 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row align-items justify-center py-2 gap-2">
          <div className="form-control max-w-xs text-black">
            <label className="label" htmlFor="keywords">
              <span className="label-text text-primary">Keywords</span>
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
              <span className="label-text text-primary">Length</span>
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
            <label htmlFor="units" className="label">
              <span className="label-text text-primary">Units</span>
            </label>
            <div className="join">
              <input
                className="join-item btn"
                type="radio"
                value="words"
                checked={unit === "words"}
                name="unites"
                aria-label="Words"
                onChange={handleUnitChange}
              />
              <input
                className="join-item btn"
                type="radio"
                value="sentences"
                checked={unit === "sentences"}
                name="units"
                aria-label="Sentences"
                onChange={handleUnitChange}
              />
              <input
                className="join-item btn"
                type="radio"
                value="paragraphs"
                checked={unit === "paragraphs"}
                name="units"
                aria-label="Paragraphs"
                onChange={handleUnitChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row align-items justify-center py-2 gap-2">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-primary">Add Synonyms</span>
              <input type="checkbox" className="toggle" checked />
            </label>
          </div>

          <div className="form-control max-w-xs self-end">
            <button type="submit" className="btn btn-primary">
              Make My Ipsum
            </button>
          </div>
        </div>
      </form>
      <div className="form-control w-full">
        <textarea
          className="textarea textarea-bordered text-black"
          placeholder={ipsumText}
        ></textarea>
      </div>
      <button className="btn btn-secondary my-2">Copy My Ipsum</button>
      {error && <p>{error}</p>}
      {ipsumText && <p>{ipsumText}</p>}
    </div>
  );
};
export default Generator;
