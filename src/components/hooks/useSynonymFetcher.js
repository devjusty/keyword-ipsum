import { useState, useCallback, useRef } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { logError } from "../../utils/errorLogging";

const datamuseSchema = z.array(z.object({ word: z.string() }));

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 10,
  MIN_REQUEST_INTERVAL_MS: 100, // Minimum time between requests
};

const fetchWithTimeout = async (resource, options = {}, timeoutMs = 5000) => {
  if (
    typeof AbortSignal !== "undefined" &&
    typeof AbortSignal.timeout === "function"
  ) {
    return fetch(resource, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
  }

  if (typeof AbortController === "undefined") {
    return fetch(resource, options);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const useSynonymFetcher = () => {
  const [synonymsCache, setSynonymsCache] = useState({});
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false);
  const requestTimestamps = useRef([]);
  const lastRequestTime = useRef(0);

  // Rate limiter function
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60_000;

    // Remove timestamps older than 1 minute
    requestTimestamps.current = requestTimestamps.current.filter(
      (timestamp) => timestamp > oneMinuteAgo,
    );

    // Check if we've exceeded the rate limit
    if (
      requestTimestamps.current.length >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE
    ) {
      return false;
    }

    // Check minimum interval between requests
    if (now - lastRequestTime.current < RATE_LIMIT.MIN_REQUEST_INTERVAL_MS) {
      return false;
    }

    return true;
  }, []);

  const fetchSynonyms = useCallback(
    async (keywords) => {
      // Check rate limit
      if (!checkRateLimit()) {
        toast.error("Too many requests. Please wait a moment.", {
          position: "bottom-center",
          duration: 2000,
          icon: "⏳",
        });
        return synonymsCache;
      }

      setIsLoadingSynonyms(true);

      const newSynonyms = {};
      const keywordsToFetch = keywords.filter((k) => !synonymsCache[k]);

      try {
        if (keywordsToFetch.length > 0) {
          // Use proxy in development, direct API in production
          const apiBaseUrl =
            import.meta.env.MODE === "development"
              ? "/api/datamuse"
              : "https://api.datamuse.com";

          const synonymPromises = keywordsToFetch.map(async (keyword) => {
            try {
              // Update rate limit tracking
              const now = Date.now();
              requestTimestamps.current.push(now);
              lastRequestTime.current = now;

              const response = await fetchWithTimeout(
                `${apiBaseUrl}/words?rel_syn=${encodeURIComponent(keyword)}`,
                {},
                5000,
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
    [synonymsCache, checkRateLimit],
  );

  return { fetchSynonyms, synonymsCache, isLoadingSynonyms };
};

export default useSynonymFetcher;
