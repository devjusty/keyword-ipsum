import { useState, useCallback } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { logError } from "../../utils/errorLogging";

const datamuseSchema = z.array(z.object({ word: z.string() }));

const useSynonymFetcher = () => {
  const [synonymsCache, setSynonymsCache] = useState({});
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false);

  const fetchSynonyms = useCallback(
    async (keywords) => {
      setIsLoadingSynonyms(true);

      const newSynonyms = {};
      const keywordsToFetch = keywords.filter((k) => !synonymsCache[k]);

      try {
        if (keywordsToFetch.length > 0) {
          const synonymPromises = keywordsToFetch.map(async (keyword) => {
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

          const results = await Promise.all(synonymPromises);

          for (const result of results) {
            if (result && typeof result === "object") {
              Object.assign(newSynonyms, result);
            }
          }
        }

        if (Object.keys(newSynonyms).length > 0) {
          setSynonymsCache((previous) => ({
            ...previous,
            ...newSynonyms,
          }));
        }

        setIsLoadingSynonyms(false);

        const allSynonyms = { ...synonymsCache, ...newSynonyms };
        return allSynonyms;
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

export default useSynonymFetcher;
