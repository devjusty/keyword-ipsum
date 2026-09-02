import { memo } from "react";
import ChipInput from "./ChipInput";
import { MAX_GENERATION_LENGTH } from "../utils/generatorLogic";

const GeneratorForm = ({
  keywords,
  setKeywords,
  useSynonyms,
  setUseSynonyms,
  length,
  setLength,
  unit,

  startWithLorem,
  setStartWithLorem,
  startWithLoremEnabled,
  keywordProbability,
  setKeywordProbability,
  handleSubmit,
  isLoadingSynonyms,
  synonymsCache,
  handleUnitChange,
}) => {
  let loadedKeywordCount = 0;
  for (const keyword of keywords) {
    if (Object.prototype.hasOwnProperty.call(synonymsCache, keyword)) {
      loadedKeywordCount += 1;
    }
  }

  const keywordLabel = loadedKeywordCount === 1 ? "keyword" : "keywords";
  const synonymStatus = isLoadingSynonyms
    ? "Loading synonyms..."
    : `Synonyms ready for ${loadedKeywordCount} ${keywordLabel}.`;

  return (
    <form
      className="generator-form workbench__controls"
      onSubmit={handleSubmit}
      aria-labelledby="generator-title"
      aria-busy={isLoadingSynonyms}
    >
      <div className="form-heading">
        <p className="section-kicker">Create placeholder copy</p>
        <h2 id="generator-title">Build a passage</h2>
      </div>

      <section
        className="control-group control-group--keywords"
        aria-labelledby="keywords-heading"
      >
        <div className="control-group__heading">
          <h3 id="keywords-heading">Keywords</h3>
          <p>Add words you want to appear in the passage.</p>
        </div>

        <div className="generator-form__keywords">
          <ChipInput
            label="Keywords to include"
            name="keywords"
            value={keywords}
            onChange={setKeywords}
            placeholder="Type a keyword"
            maxChips={10}
          />

          <div className="generator-form__synonyms">
            <label htmlFor="use-synonyms">Include synonyms</label>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={useSynonyms}
              onChange={() => setUseSynonyms(!useSynonyms)}
              id="use-synonyms"
            />
          </div>
        </div>
      </section>

      <section className="control-group" aria-labelledby="shape-heading">
        <div className="control-group__heading">
          <h3 id="shape-heading">Output</h3>
        </div>

        <div className="generator-form__generation-controls">
          <div className="length-control">
            <label htmlFor="length">Number</label>
            <input
              type="number"
              id="length"
              min={1}
              max={MAX_GENERATION_LENGTH}
              value={length}
              onChange={(event) => setLength(event.target.value)}
              className="input input-bordered"
            />
          </div>

          <div className="unit-control">
            <div className="control-label">
              <span id="units-label">Units</span>
            </div>
            <div
              className="join"
              role="radiogroup"
              aria-labelledby="units-label"
            >
              <input
                className="join-item btn"
                type="radio"
                value="paragraphs"
                checked={unit === "paragraphs"}
                name="units"
                aria-label="Paragraphs"
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
                value="words"
                checked={unit === "words"}
                name="units"
                aria-label="Words"
                onChange={handleUnitChange}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="control-group" aria-labelledby="texture-heading">
        <div className="control-group__heading">
          <h3 id="texture-heading">Style</h3>
        </div>

        <div className="generator-form__options">
          <div className="density-control">
            <label htmlFor="keyword-probability">Keyword density</label>
            <div className="range-row">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={keywordProbability}
                onChange={(event) =>
                  setKeywordProbability(Number.parseFloat(event.target.value))
                }
                className="range range-primary"
                id="keyword-probability"
              />
              <output htmlFor="keyword-probability">
                {Math.round(keywordProbability * 100)}%
              </output>
            </div>
          </div>

          <label className="lorem-option" htmlFor="start-with-lorem">
            <span>Begin with Lorem Ipsum</span>
            <input
              id="start-with-lorem"
              type="checkbox"
              checked={startWithLoremEnabled && startWithLorem}
              disabled={!startWithLoremEnabled}
              onChange={() =>
                startWithLoremEnabled && setStartWithLorem(!startWithLorem)
              }
              title={
                startWithLoremEnabled
                  ? undefined
                  : "This option is unavailable when generating words."
              }
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
      </section>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Generate text
        </button>
      </div>

      {/* Synonym status display */}
      {useSynonyms && (
        <div className="synonym-status">
          {isLoadingSynonyms && (
            <span className="inline-flex items-center gap-2">
              <span className="loading loading-spinner loading-xs"></span>
            </span>
          )}
          {synonymStatus}
        </div>
      )}
    </form>
  );
};

export default memo(GeneratorForm);
