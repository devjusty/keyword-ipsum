import { useState, useCallback, useMemo, memo } from "react";
import DOMPurify from "dompurify";
import toast, { Toaster } from "react-hot-toast";
import {
  generateIpsum,
  isValidGenerationLength,
  MAX_GENERATION_LENGTH,
} from "../utils/generatorLogic";
import { logError } from "../utils/errorLogging";
import { trackPerformance } from "../utils/performanceTracking";
import useSynonymFetcher from "./hooks/useSynonymFetcher";
import GeneratorForm from "./GeneratorForm";
import GeneratorResult from "./GeneratorResult";

const MemoizedToaster = memo(Toaster);

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [length, setLength] = useState(5);
  const [unit, setUnit] = useState("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [keywordProbability, setKeywordProbability] = useState(0.3);

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

  const processedKeywords = useMemo(() => {
    return keywords.filter(Boolean);
  }, [keywords]);

  const handleUnitChange = useCallback((event) => {
    setUnit(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { keywordList, errors } = validateKeywords(keywords);

      if (errors.length > 0) {
        for (const error of errors) {
          toast.error(error, {
            position: "bottom-center",
            duration: 2000,
          });
        }
        return;
      }

      const parsedLength = Number(length);
      if (!isValidGenerationLength(parsedLength)) {
        toast.error(
          `Length must be a whole number from 1 to ${MAX_GENERATION_LENGTH}`,
          {
            position: "bottom-center",
            duration: 2000,
          },
        );
        return;
      }

      try {
        let finalKeywords = processedKeywords;

        if (useSynonyms) {
          const allSynonyms = await fetchSynonyms(keywordList);
          finalKeywords = keywords.flatMap((keyword) => [
            keyword,
            ...(allSynonyms[keyword] || []),
          ]);
        }

        const generatedText = trackPerformance(
          "Ipsum Generation",
          generateIpsum,
        )(finalKeywords, parsedLength, unit, {
          startWithLorem: unit !== "words" && startWithLorem,
          keywordProbability,
        });

        const sanitizedText = DOMPurify.sanitize(generatedText);
        setIpsumText(sanitizedText);
      } catch (error) {
        logError("Ipsum Generation Error", error);
        toast.error("Failed to generate Ipsum text", {
          position: "bottom-center",
          duration: 2000,
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
      startWithLorem,
      keywordProbability,
    ],
  );

  return (
    <>
      <MemoizedToaster />

      {isLoadingSynonyms && (
        <div
          className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="status"
          aria-live="polite"
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <span className="sr-only">Fetching synonyms...</span>
        </div>
      )}

      <GeneratorForm
        keywords={keywords}
        setKeywords={setKeywords}
        useSynonyms={useSynonyms}
        setUseSynonyms={setUseSynonyms}
        length={length}
        setLength={setLength}
        unit={unit}
        setUnit={setUnit}
        startWithLorem={startWithLorem}
        setStartWithLorem={setStartWithLorem}
        startWithLoremEnabled={unit !== "words"}
        keywordProbability={keywordProbability}
        setKeywordProbability={setKeywordProbability}
        handleSubmit={handleSubmit}
        isLoadingSynonyms={isLoadingSynonyms}
        synonymsCache={synonymsCache}
        handleUnitChange={handleUnitChange}
      />

      <GeneratorResult ipsumText={ipsumText} unit={unit} />
    </>
  );
};
export default Generator;
