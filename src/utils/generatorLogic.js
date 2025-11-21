// Constants
// cSpell: disable
const LOREM_IPSUM_WORDS = Object.freeze([
  "Lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "Ut",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "Duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "Excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
]);
// cSpell: enable

const SENTENCE_WORD_COUNT = { min: 3, max: 15 };
const PARAGRAPH_SENTENCE_COUNT = { min: 1, max: 7 };

/**
 * Fast random number generator using xorshift32 algorithm
 */
let seed = Date.now();
function fastRandom() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return (seed >>> 0) / 0x1_00_00_00_00; // Convert to float in [0, 1)
}

const computeSeedFromKeywords = (keywords) => {
  const FNV_OFFSET = 0x81_1c_9d_c5;
  const FNV_PRIME = 0x01_00_01_93;

  let hash = FNV_OFFSET;

  for (const word of keywords) {
    for (const symbol of word) {
      hash ^= symbol.codePointAt(0);
      hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
    hash = Math.imul(hash ^ 0x9e_37_79_b9, FNV_PRIME) >>> 0;
  }

  return hash || FNV_OFFSET;
};

/**
 * Get a random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => {
  return Math.floor(fastRandom() * (max - min + 1)) + min;
};

const capitalizeWord = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const applyLoremPrefix = (words) => {
  for (
    let index = 0;
    index < words.length && index < LOREM_IPSUM_WORDS.length;
    index++
  ) {
    words[index] = LOREM_IPSUM_WORDS[index];
  }
};

const buildSentence = (wordCount, getWord, useLoremPrefix) => {
  const words = Array.from({ length: wordCount }, () => getWord());
  if (useLoremPrefix) applyLoremPrefix(words);

  const [firstWord, ...rest] = words;
  const first = capitalizeWord(firstWord);
  const tail = rest.join(" ");
  return tail ? `${first} ${tail}.` : `${first}.`;
};

/**
 * Generate a sequence of random words
 */
const generateIpsum = (
  keywords,
  length,
  unit,
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  options = { startWithLorem: true, keywordProbability: 0.3 },
) => {
  // Reset seed for deterministic results with the same input
  seed = keywords.length > 0 ? computeSeedFromKeywords(keywords) : Date.now();

  // Pre-calculate word selection probabilities
  const {
    startWithLorem: startWithLoremOption = true,
    keywordProbability = 0.3,
  } = options;
  const hasKeywords = keywords.length > 0;
  const loremWordsLength = LOREM_IPSUM_WORDS.length;
  const keywordsLength = keywords.length;
  const shouldStartWithLorem = startWithLoremOption && unit !== "words";

  // Optimized random word generator
  const getRandomWord = () => {
    if (hasKeywords && fastRandom() < keywordProbability) {
      return keywords[Math.floor(fastRandom() * keywordsLength)];
    }
    return LOREM_IPSUM_WORDS[Math.floor(fastRandom() * loremWordsLength)];
  };

  // Generate sentence with specified word count
  let text = "";

  // Generate content based on unit type
  switch (unit) {
    case "words": {
      const words = Array.from({ length }, () => getRandomWord());
      if (shouldStartWithLorem) {
        applyLoremPrefix(words);
      }
      text = words.join(" ");
      break;
    }

    case "sentences": {
      text = Array.from({ length }, (_, index) =>
        buildSentence(
          getRandomInt(SENTENCE_WORD_COUNT.min, SENTENCE_WORD_COUNT.max),
          getRandomWord,
          shouldStartWithLorem && index === 0,
        ),
      ).join(" ");
      break;
    }

    case "paragraphs": {
      text = Array.from({ length }, (_, paragraphIndex) => {
        const sentenceCount = getRandomInt(
          PARAGRAPH_SENTENCE_COUNT.min,
          PARAGRAPH_SENTENCE_COUNT.max,
        );

        return Array.from({ length: sentenceCount }, (_, sentenceIndex) =>
          buildSentence(
            getRandomInt(SENTENCE_WORD_COUNT.min, SENTENCE_WORD_COUNT.max),
            getRandomWord,
            shouldStartWithLorem && paragraphIndex === 0 && sentenceIndex === 0,
          ),
        ).join(" ");
      }).join("\n\n");
      break;
    }

    default: {
      return "";
    }
  }

  return text;
};

export { generateIpsum };
