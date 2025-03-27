import { useState, useEffect, useCallback, useMemo } from "react";
import { generateIpsum } from "../utils/GeneratorLogic";
import toast, { Toaster } from "react-hot-toast";

const Generator = () => {
  const [ipsumText, setIpsumText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [synonyms, setSynonyms] = useState([]);
  const [keywordSynonyms, setKeywordSynonyms] = useState({});
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false);
  const [synonymsCache, setSynonymsCache] = useState({});
  const [useSynonyms, setUseSynonyms] = useState(false);
  const [length, setLength] = useState(5);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("sentences");

  const fetchSynonyms = useCallback(async (keyword) => {
    setIsLoadingSynonyms(true);
    // Check if the synonym is already cached
    if (synonymsCache[keyword]) {
      return synonymsCache[keyword];
    }

    const synonymPromises = keyword.map(async (keyword) => {
      if (!keywordSynonyms[keyword]) {
        try {
          const response = await fetch(`https://api.datamuse.com/words?rel_syn=${keyword}`);
          const data = await response.json();

          return {
            [keyword]: data
            .slice(0, 5)
            .map((item) => item.word)
            .filter((word) => word.toLowerCase() !== keyword.toLowerCase()),
          };
        } catch (error) {
          return { [keyword]: [] };
        }
      }
      return { [keyword]: keywordSynonyms[keyword] };
    });

    const results = await Promise.all(synonymPromises);

    const newSynonyms = results.reduce((acc, curr) => ({...acc, ...curr}), {});
  };

    setKeywordSynonyms((prev) => ({...prev, ...newSynonyms}));
    setIsLoadingSynonyms(false);

    try {
      const response = await fetch(`https://api.datamuse.com/words?rel_syn=${keyword}`);
      const data = await response.json();

      // Extract top 5 synonyms
      const synonymList = data
        .slice(0, 5)
        .map((item) => item.word)
        .filter((word) => word.toLowerCase() !== keyword.toLowerCase());


      // Update the cache
      setSynonymsCache((prev) => ({
        ...prev,
        [keyword]: synonymList,
      }));

      return synonymList;
    } catch (error) {
      toast.error("Failed to fetch synonyms", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
      return []
    }
  }, [synonymsCache]);

  // Memoize the synonyms to prevent unnecessary re-renders
  const processedSynonyms = useMemo(() => {
    if (!useSynonyms) return keywords.split(/[,\s]+/);

    return keywords.split(/[,\s]+/).flatMap((keyword) => {
      const cachedSynonyms = synonymsCache[keyword] || [];
      return [keyword, ...cachedSynonyms];
    });
  }, [keywords, synonymsCache, useSynonyms]);

  const handleKeywordChange = (event) => {
    const value = event.target.value;
    setKeywords(value);

    // Optionally fetch synonyms
    if (useSynonyms) {
      const keywordList = value.split(/[,\s]+/);
      keywordList.forEach((keyword) => {
        if (keyword && !synonyms[keyword]) {
          fetchSynonyms(keyword);
        }
      });
    }
  };

  useEffect(() => {
    if (useSynonyms && keywords) {
      const keywordList = keywords.split(/[,\s]+/);
      fetchSynonyms(keywordList);
    }
  }, [useSynonyms, keywords]);

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const keywordList = keywords.split(/[,\s]+/);
    const finalKeywords = useSynonyms
      ? keywordList.split(/[,\s]+/).flatMap((keyword) => (synonyms[keyword] ? [keyword, ...synonyms[keyword]] : [keyword]))
      : keywordList;

    // Trim and validate keywords
    const trimmedKeywords = keywords.trim();

    // Clear previous error state
    setError("");

    // Validation with toast notifications
    if (!trimmedKeywords) {
      toast.error("Please enter keywords", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
      return;
    }

    if (isNaN(length) || length <= 0) {
      toast.error("Please enter a positive number for length", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
      return;
    }

    // Generate the Ipsum text
    try {
      const generatedText = generateIpsum(trimmedKeywords.split(/[,\s]+/), parseInt(length), unit);
      setIpsumText(generatedText);
    } catch (error) {
      toast.error("Failed to generate Ipsum text", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
    }
  };

  const handleCopyText = () => {
    if (ipsumText) {
      navigator.clipboard
        .writeText(ipsumText)
        .then(() => {
          toast.success("Copied to clipboard", {
            position: "bottom-center",
            duration: 2000,
            icon: "📋",
          });
        })
        .catch((error) => {
          toast.error("Failed to copy text", {
            position: "bottom-center",
            duration: 2000,
            icon: "❌",
          });
        });
    } else {
      toast.error("No text to copy", {
        position: "bottom-center",
        duration: 2000,
        icon: "❌",
      });
    }
  };

  return (
    <>
      <Toaster />
      {isLoadingSynonyms && (
        <div className="loading-overlay">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <form className="form py-4 mx-auto" onSubmit={handleSubmit} aria-labelledby='generator-title'>
      <div id='generator-title' className="sr-only">
        Lorem Ipsum Generator
      </div>
        <div className="flex flex-col md:flex-row gap-2 mb-2 space-y-2 md:space-y-0">
          <div className="form-control">
            <label className="label" htmlFor="keywords">
              <span className="label-text text-primary">Keywords</span>
            </label>
            <input
              type="text"
              value={keywords}
              id="keywords"
              onChange={handleKeywordChange}
              placeholder="awesome, radical, sick"
              className="input input-bordered"
              aria-describedby='keywords-hint'
            />
                 <small id="keywords-hint" className="text-gray-500">
        Enter keywords separated by commas
      </small>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="length">
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

        <div className="flex flex-col med:flex-row items-center gap-2 mb-4">
          <div className="form-control max-w-xs w-full">
          <div role='radiogroup' aria-labelledby='units-label'>
            <span id="units-label" className="sr-only">Select text generation units</span>
            <label htmlFor="units" className="label">
              <span className="label-text text-primary">Units</span>
            </label>
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
          </div>

          </div>

          <div className="form-control flex-row items-center gap-2 w-full">
            <label className="label cursor-pointer py-2">
              <span className="label-text text-primary mr-1">Add Synonyms</span>
              <input
                type="checkbox"
                className="toggle"
                checked={useSynonyms}
                onChange={() => setUseSynonyms(!useSynonyms)}
              />
            </label>

            <button type="submit" className="btn btn-primary ml-auto">
              Make My Ipsum
            </button>
          </div>
        </div>
      </form>

      <div className="w-full">
        <div className="bg-base-200 rounded-lg p-4 mb-2 min-h-[200px]">
          {ipsumText ? (
            <pre className="whitespace-pre-wrap break-words">{ipsumText}</pre>
          ) : (
            <p className="text-gray-500 text-center">Enter keywords and generate your custom Lorem Ipsum.</p>
          )}
        </div>

        <div className="flex justy-between items-center">
          <div className="text-sm text-gray-500">
            {ipsumText && `${unit.charAt(0).toUpperCase() + unit.slice(1)}: ${ipsumText.split(/\s+/).length}`}
          </div>
          <button className="btn btn-secondary" onClick={handleCopyText} disabled={!ipsumText} aria-label='Copy Ipsum text'>
            Copy My Ipsum
          </button>
        </div>
      </div>
    </>
  );
};
export default Generator;
