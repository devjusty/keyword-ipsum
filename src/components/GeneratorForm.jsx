import { memo } from "react";
import ChipInput from "./ChipInput";

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
  keywordProbability,
  setKeywordProbability,
  handleSubmit,
  isLoadingSynonyms,
  synonymsCache,
  handleUnitChange,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl mx-auto max-w-2xl">
      <div className="card-body p-6 md:p-8">
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          aria-labelledby="generator-title"
        >
          <h2
            id="generator-title"
            className="card-title text-2xl font-bold mb-2"
          >
            Lorem Ipsum Generator
          </h2>

          {/* Keywords and Toggle Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <ChipInput
                label="Keywords"
                name="keywords"
                value={keywords}
                onChange={setKeywords}
                placeholder="Type and press Enter"
                maxChips={10}
              />
            </div>

            <div className="flex flex-col items-center">
              <label
                className="block text-sm font-medium mb-2 text-accent"
                htmlFor="use-synonyms"
              >
                Add Synonyms
              </label>
              <div className="">
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-lg mt-2"
                  checked={useSynonyms}
                  onChange={() => setUseSynonyms(!useSynonyms)}
                  id="use-synonyms"
                />
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            {/* Length Input */}
            <div className="form-control w-full sm:max-w-[120px]">
              <label className="label pb-1" htmlFor="length">
                <span className="label-text font-medium mb-2 text-accent">
                  Length
                </span>
              </label>
              <input
                type="number"
                id="length"
                min={1}
                value={length}
                onChange={(event) => setLength(event.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            {/* Unit Selector */}
            <div className="form-control w-full">
              <label className="label pb-1" htmlFor="units">
                <span className="label-text font-medium mb-2 text-accent">
                  Units
                </span>
              </label>
              <div
                className="join w-full"
                role="radiogroup"
                aria-labelledby="units-label"
              >
                <input
                  className="join-item btn flex-1"
                  type="radio"
                  value="paragraphs"
                  checked={unit === "paragraphs"}
                  name="units"
                  aria-label="Paragraphs"
                  onChange={handleUnitChange}
                />
                <input
                  className="join-item btn flex-1"
                  type="radio"
                  value="sentences"
                  checked={unit === "sentences"}
                  name="units"
                  aria-label="Sentences"
                  onChange={handleUnitChange}
                />
                <input
                  className="join-item btn flex-1"
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

          {/* Options Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="form-control w-full">
              <label className="label pb-1" htmlFor="keyword-probability">
                <span className="label-text font-medium mb-2 text-accent">
                  Keyword Density
                </span>
              </label>
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
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-medium mr-2 text-accent">
                  Start with &apos;Lorem Ipsum&apos;
                </span>
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={() => setStartWithLorem(!startWithLorem)}
                  className="checkbox checkbox-primary"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto min-w-[200px]"
            >
              Generate Ipsum
            </button>
          </div>

          {/* Synonym status display */}
          {useSynonyms && (
            <div className="text-sm text-base-content/60 text-center">
              {isLoadingSynonyms ? (
                <span className="inline-flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs"></span>
                  Fetching synonyms...
                </span>
              ) : (
                `Synonyms loaded for ${
                  Object.keys(synonymsCache).length
                } keyword(s)`
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default memo(GeneratorForm);
