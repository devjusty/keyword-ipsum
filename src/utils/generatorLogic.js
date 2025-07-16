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

/**
 * Get a random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => {
  return Math.floor(fastRandom() * (max - min + 1)) + min;
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
  seed =
    keywords.length > 0
      ? keywords.reduce(
          (accumulator, word) => accumulator + word.codePointAt(0),
          0,
        )
      : Date.now();

  // Pre-calculate word selection probabilities
  const { keywordProbability } = options;
  const hasKeywords = keywords.length > 0;
  const loremWordsLength = LOREM_IPSUM_WORDS.length;
  const keywordsLength = keywords.length;

  // Optimized random word generator
  const getRandomWord = () => {
    if (hasKeywords && fastRandom() < keywordProbability) {
      return keywords[Math.floor(fastRandom() * keywordsLength)];
    }
    return LOREM_IPSUM_WORDS[Math.floor(fastRandom() * loremWordsLength)];
  };

  // Generate sentence with specified word count
  const generateSentence = (wordCount) => {
    let sentence = "";
    for (let index = 0; index < wordCount; index++) {
      if (index > 0) sentence += " ";
      sentence +=
        index === 0
          ? getRandomWord().charAt(0).toUpperCase() + getRandomWord().slice(1)
          : getRandomWord();
    }
    return sentence + ".";
  };

  // Generate paragraph with specified sentence count
  const generateParagraph = (sentenceCount) => {
    let paragraph = "";
    for (let index = 0; index < sentenceCount; index++) {
      if (index > 0) paragraph += " ";
      paragraph += generateSentence(
        getRandomInt(SENTENCE_WORD_COUNT.min, SENTENCE_WORD_COUNT.max),
      );
    }
    return paragraph;
  };

  let text = "";

  // Generate content based on unit type
  switch (unit) {
    case "words": {
      text = Array.from({ length }, getRandomWord).join(" ");
      break;
    }

    case "sentences": {
      text = Array.from({ length }, () =>
        generateSentence(
          getRandomInt(SENTENCE_WORD_COUNT.min, SENTENCE_WORD_COUNT.max),
        ),
      ).join(" ");
      break;
    }

    case "paragraphs": {
      text = Array.from({ length }, () =>
        generateParagraph(
          getRandomInt(
            PARAGRAPH_SENTENCE_COUNT.min,
            PARAGRAPH_SENTENCE_COUNT.max,
          ),
        ),
      ).join("\n\n");
      break;
    }

    default: {
      return "";
    }
  }

  if (options.startWithLorem) {
    return `${LOREM_IPSUM_WORDS.slice(0, 5).join(" ")} ${text}`;
  }

  return text;
};

export { generateIpsum };
