import { useState, useCallback, useMemo, memo } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";
import toast, { Toaster } from "react-hot-toast";
import { generateIpsum } from "../utils/generatorLogic";
import { logError } from "../utils/errorLogging";
import { trackPerformance } from "../utils/performanceTracking";
import ChipInput from "./ChipInput";

// Memoized Toaster component to prevent re-renders
const MemoizedToaster = memo(Toaster);

// Zod schema for API response validation
const datamuseSchema = z.array(z.object({ word: z.string() }));

// Custom hook for synonym fetching and caching
const useSynonymFetcher = () => {
  const [synonymsCache, setSynonymsCache] = useState({});
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false);

  const fetchSynonyms = useCallback(
    async (keywords) => {
      setIsLoadingSynonyms(true);

      // Track new synonyms to update cache
      const newSynonyms = {};

      try {
        // Process keywords in parallel, but only for uncached keywords
        const synonymPromises = keywords
          .filter((keyword) => !synonymsCache[keyword])
          .map(async (keyword) => {
            try {
              const response = await fetch(
                `https://api.datamuse.com/words?rel_syn=${keyword}`,
              );
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              const validData = datamuseSchema.parse(data);

              return {
                [keyword]: validData
                  .slice(0, 5)
                  .map((item) => item.word)
                  .filter(
                    (word) => word.toLowerCase() !== keyword.toLowerCase(),
                  ),
              };
            } catch (error) {
              logError("Synonym Fetch", error, { keyword });
              return { [keyword]: [] };
            }
          });

        // Wait for all synonym fetches
        const results = await Promise.all(synonymPromises);

        // Merge results into cache
        for (const result of results) {
          if (result && typeof result === "object") {
            for (const [keyword, synonyms] of Object.entries(result)) {
              newSynonyms[keyword] = synonyms;
            }
          }
        }

        // Update cache
        setSynonymsCache((previous) => ({
          ...previous,
          ...newSynonyms,
        }));

        setIsLoadingSynonyms(false);
        return newSynonyms;
      } catch (error) {
        logError("Synonym Fetching Main", error);
        setIsLoadingSynonyms(false);
        toast.error("Failed to fetch synonyms", {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        });
        return {};
      }
    },
    [synonymsCache],
  );

  return { fetchSynonyms, synonymsCache, isLoadingSynonyms };
};

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [length, setLength] = useState(5);
  const [unit, setUnit] = useState("paragraphs");

  // Custom hook for synonym fetching and caching
  const { fetchSynonyms, synonymsCache, isLoadingSynonyms } =
    useSynonymFetcher();

  const validateKeywords = useCallback((keywordList) => {
    const errors = [];

    if (keywordList.length === 0) {
      errors.push("Please enter keywords");
    }
    if (keywordList.length > 10) {
      errors.push("Maximum 10 keywords allowed");
    }
    if (keywordList.some((kw) => kw.length > 20)) {
      errors.push("Keywords too long (max 20 characters)");
    }

    return { keywordList, errors };
  }, []);

  // Memoized keyword validation
  // const processedKeywords = useMemo(() => {
  //   if (!useSynonyms) return keywords.split(/[,\s]+/).filter(Boolean);

  //   return keywords
  //     .split(/[,\s]+/)
  //     .filter(Boolean)
  //     .flatMap((keyword) => [keyword, ...(synonymsCache[keyword] || [])]);
  // }, [keywords, synonymsCache, useSynonyms]);

  const processedKeywords = useMemo(() => {
    return keywords.filter(Boolean);
  }, [keywords]);

  // const handleKeywordChange = (event) => {
  //   setKeywords(event.target.value);
  // };

  const handleUnitChange = useCallback((event) => {
    setUnit(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // Validate keywords
      const { keywordList, errors } = validateKeywords(keywords);

      // Handle validation errors
      if (errors.length > 0) {
        for (const error of errors) {
          toast.error(error, {
            position: "bottom-center",
            duration: 2000,
            icon: "❌",
          });
        }
        return;
      }

      // Validate length
      const parsedLength = Number.parseInt(length, 10);
      if (Number.isNaN(parsedLength) || parsedLength <= 0) {
        toast.error("Please enter a positive number for length", {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        });
        return;
      }

      try {
        let finalKeywords = processedKeywords;

        // Fetch synonyms if enabled
        if (useSynonyms) {
          const newSynonyms = await fetchSynonyms(keywordList);
          finalKeywords = keywords.flatMap((keyword) => [
            keyword,
            ...(newSynonyms[keyword] || []),
          ]);
        }

        // Generate Ipsum text
        const generatedText = trackPerformance(
          "Ipsum Generation",
          generateIpsum,
        )(finalKeywords, parsedLength, unit);

        // Sanitize and set text
        const sanitizedText = DOMPurify.sanitize(generatedText);
        setIpsumText(sanitizedText);
      } catch (error) {
        logError("Ipsum Generation Error", error);
        toast.error("Failed to generate Ipsum text", {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        });
      }
    },
    [
      keywords,
      length,
      unit,
      useSynonyms,
      validateKeywords,
      fetchSynonyms,
      processedKeywords,
    ],
  );

  // Memoized copy to clipboard handler
  const handleCopyText = useCallback(() => {
    if (!ipsumText) {
      toast.error("No text to copy", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
      return;
    }
    navigator.clipboard
      .writeText(ipsumText)
      .then(() =>
        toast.success("Copied to clipboard", {
          position: "bottom-center",
          duration: 2000,
          icon: "📋",
        }),
      )
      .catch(() =>
        toast.error("Failed to copy text", {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        }),
      );
  }, [ipsumText]);

  // Memoized text count calculation
  const textCount = useMemo(() => {
    if (!ipsumText) return "";

    switch (unit) {
      case "words": {
        return `Words: ${ipsumText.split(/\s+/).length}`;
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

  return (
    <>
      <MemoizedToaster />

      {/* Loading overlay for synonym fetching */}
      {isLoadingSynonyms && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

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
                  `Synonyms loaded for ${Object.keys(synonymsCache).length} keyword(s)`
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Result display section */}
      {ipsumText && (
        <div className="card bg-base-100 shadow-xl mx-auto max-w-2xl mt-8">
          <div className="card-body p-6 md:p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generated Text</h3>
              <div className="badge badge-ghost">{textCount}</div>
            </div>

            <div className="bg-base-200 rounded-box p-6 min-h-[200px] overflow-auto">
              <pre className="whitespace-pre-wrap break-words font-sans">
                {ipsumText}
              </pre>
            </div>

            <div className="card-actions justify-end mt-4">
              <button
                className="btn btn-outline btn-sm"
                onClick={handleCopyText}
                disabled={!ipsumText}
                aria-label="Copy Ipsum text"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!ipsumText && (
        <div className="card bg-base-100 shadow-xl mx-auto max-w-2xl mt-8">
          <div className="card-body items-center text-center p-8">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">Your Ipsum Awaits</h3>
            <p className="text-base-content/60 mb-4">
              Enter your keywords and generate custom Lorem Ipsum text.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
export default Generator;
