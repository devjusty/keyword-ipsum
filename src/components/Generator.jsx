import { useState, useCallback, useMemo } from "react";
import { z } from "zod";
import DOMPurify from "dompurify";
import toast, { Toaster } from "react-hot-toast";
import ChipInput from './ChipInput';

import { generateIpsum } from "../utils/generatorLogic";
import { logError } from "../utils/errorLogging";
import { trackPerformance } from "../utils/performanceTracking";

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
              const response = await fetch(`https://api.datamuse.com/words?rel_syn=${keyword}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              const validData = datamuseSchema.parse(data);

              return {
                [keyword]: validData
                  .slice(0, 5)
                  .map((item) => item.word)
                  .filter((word) => word.toLowerCase() !== keyword.toLowerCase()),
              };
            } catch (error) {
              logError("Synonym Fetch", error, { keyword });
              return { [keyword]: [] };
            }
          });

        // Wait for all synonym fetches
        const results = await Promise.all(synonymPromises);

        // Merge results into cache
        results.forEach((result) => {
          if (result && typeof result === "object") {
            Object.entries(result).forEach(([keyword, synonyms]) => {
              newSynonyms[keyword] = synonyms;
            });
          }
        });

        // Update cache
        setSynonymsCache((prev) => ({
          ...prev,
          ...newSynonyms,
        }));

        setIsLoadingSynonyms(false);
        return newSynonyms;
      } catch (error) {
        logError("Synonym Fetching Main", error);
        setIsLoadingSynonyms(false);
        toast.error("Failed to fetch synonyms", { position: "bottom-center", duration: 2000, icon: "❌" });
        return {};
      }
    },
    [synonymsCache]
  );

  return { fetchSynonyms, synonymsCache, isLoadingSynonyms };
};

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [length, setLength] = useState(5);
  const [unit, setUnit] = useState("sentences");

  // Custom hook for synonym fetching and caching
  const { fetchSynonyms, synonymsCache, isLoadingSynonyms } = useSynonymFetcher();

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

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate keywords
    const { keywordList, errors } = validateKeywords(keywords);

    // Handle validation errors
    if (errors.length > 0) {
      errors.forEach((error) =>
        toast.error(error, {
          position: "bottom-center",
          duration: 2000,
          icon: "❌",
        })
      );
      return;
    }

    // Validate length
    const parsedLength = parseInt(length, 10);
    if (isNaN(parsedLength) || parsedLength <= 0) {
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
        finalKeywords = keywords.flatMap((keyword) => [keyword, ...(newSynonyms[keyword] || [])]);
      }

      // Generate Ipsum text
      const generatedText = trackPerformance("Ipsum Generation", generateIpsum)(finalKeywords, parsedLength, unit);
      // Sanitize and set text
      const sanitizedText = DOMPurify.sanitize(generatedText);
      setIpsumText(sanitizedText);
    } catch {
      toast.error("Failed to generate Ipsum text", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
    }
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    if (!ipsumText) {
      toast.error("No text to copy", { position: "bottom-center", duration: 2000, icon: "❌" });
      return;
    }
    navigator.clipboard
      .writeText(ipsumText)
      .then(() => toast.success("Copied to clipboard", { position: "bottom-center", duration: 2000, icon: "📋" }))
      .catch(() => toast.error("Failed to copy text", { position: "bottom-center", duration: 2000, icon: "❌" }));
  };

  // Render text count based on selected unit
  const renderTextCount = () => {
    if (!ipsumText) return null;

    switch (unit) {
      case "words":
        return `Words: ${ipsumText.split(/\s+/).length}`;
      case "sentences":
        return `Sentences: ${ipsumText.split(/[.!?]+/).filter(Boolean).length}`;
      case "paragraphs":
        return `Paragraphs: ${ipsumText.split(/\n{2,}/).filter(Boolean).length}`;
    }
  };

  return (
    <>
      <Toaster />

      {/* Loading overlay for synonym fetching */}
      {isLoadingSynonyms && (
        <div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      <form
        className="form py-6 px-4 mx-auto max-w-xl space-y-6"
        onSubmit={handleSubmit}
        aria-labelledby="generator-title"
      >
        <div id="generator-title" className="sr-only">
          Lorem Ipsum Generator
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="form-control">
            <ChipInput
              label="Keywords"
              name="keywords"
              value={keywords}
              onChange={setKeywords}
             />
          </div>

          <div className="form-control">
            <label className="label mb-1 mr-2" htmlFor="length">
              <span className="label-text text-primary">Length</span>
            </label>
            <input
              type="number"
              id="length"
              min={1}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="input input-bordered"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="form-control max-w-xs w-full">
            <div role="radiogroup" aria-labelledby="units-label">
              <span id="units-label" className="sr-only">
                Select text generation units
              </span>
              <label className="label mb-1">
                <span className="label-text text-primary mr-2">Units</span>
                <div className="join">
                  <input
                    className="join-item btn btn-sm w-1/3"
                    type="radio"
                    value="words"
                    checked={unit === "words"}
                    name="units"
                    aria-label="Words"
                    onChange={handleUnitChange}
                  />
                  <input
                    className="join-item btn btn-sm w-1/3"
                    type="radio"
                    value="sentences"
                    checked={unit === "sentences"}
                    name="units"
                    aria-label="Sentences"
                    onChange={handleUnitChange}
                  />
                  <input
                    className="join-item btn btn-sm w-1/3"
                    type="radio"
                    value="paragraphs"
                    checked={unit === "paragraphs"}
                    name="units"
                    aria-label="Paragraphs"
                    onChange={handleUnitChange}
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="form-control flex flex-col gap-4 w-full">
            <label className="label cursor-pointer py-2 mb-1" htmlFor='use-synonyms'>
              <span className="label-text text-primary mr-2">Add Synonyms</span>
              <input
                type="checkbox"
                className="toggle"
                checked={useSynonyms}
                onChange={() => setUseSynonyms(!useSynonyms)}
                id='use-synonyms'
              />
            </label>

            <button type="submit" className="btn btn-primary mx-auto">
              Make My Ipsum
            </button>
          </div>
        </div>

        {/* Synonym status display */}
        {useSynonyms && (
          <div className="text-sm text-gray-500 mt-2">
            {isLoadingSynonyms
              ? "Fetching synonyms..."
              : `Synonyms loaded for ${Object.keys(synonymsCache).length} keyword(s)`}
          </div>
        )}
      </form>

      {/* Result display section */}
      <div className="w-full px-4">
        <div className="bg-base-200 rounded-lg p-6 mb-4 min-h-[200px]">
          {ipsumText ? (
            <pre className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: ipsumText }} />
          ) : (
            <p className="text-gray-500 text-center">Enter keywords and generate your custom Lorem Ipsum.</p>
          )}
        </div>

        <div className="flex justify-between items-center px-1">
          <div className="text-sm text-gray-500">{renderTextCount()}</div>
          <button
            className="btn btn-secondary"
            onClick={handleCopyText}
            disabled={!ipsumText}
            aria-label="Copy Ipsum text"
          >
            Copy My Ipsum
          </button>
        </div>
      </div>
    </>
  );
};
export default Generator;
