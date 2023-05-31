import { useState } from "react";
import { generateIpsum } from "./GeneratorLogic";

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("keyword ipsum");
  const [keywords, setKeywords] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("sentences");

  // const [paragraphCount, setParagraphCount] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!keywords || isNaN(length) || length <= 0) {
      setError("Enter keywords and a positive number for length");
      setIpsumText("");
    } else {
      setError("");
      setIpsumText(generateIpsum(keywords.split(/[,\s]+/), parseInt(length), unit));
    }

  };

  // const generateIpsum = (keywords, length, unit) => {};

  return (
    <div>
      <form
        className="form flex flex-row gap-2 py-2 mx-auto"
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
        <div className="btn-group">
          <label htmlFor="unit" className="label"></label>
          <button
            className={unit === "words" ? "btn btn-active" : "btn"}
            onClick={() => setUnit("words")}
          >
            Words
          </button>
          <button
            className={unit === "sentences" ? "btn btn-active" : "btn"}
            onClick={() => setUnit("sentences")}
          >
            Sentences
          </button>
          <button
            className={unit === "paragraphs" ? "btn btn-active" : "btn"}
            onClick={() => setUnit("paragraphs")}
          >
            Paragraphs
          </button>
        </div>
        <button type="submit" className="btn btn-primary self-end">
          Make My Ipsum
        </button>
      </form>
      <div className="form-control w-full">
        <textarea
          className="textarea textarea-bordered text-black"
          placeholder={ipsumText}
        ></textarea>
        <button className="btn btn-secondary self-end">Copy My Ipsum</button>
      </div>
      {error && <p>{error}</p>}
      {ipsumText && <p>{ipsumText}</p>}
    </div>
  );
};
export default Generator;
