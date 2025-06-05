export function generateIpsum(keywords, length, unit) {
  const loremIpsumWords = [
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
  ];

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomWord = () => {
    if (Math.random() > 0.7 && keywords.length > 0) {
      return keywords[Math.floor(Math.random() * keywords.length)];
    }
    return loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];
  };

  const randomSentence = (wordCount = getRandomInt(3, 15)) => {
    const words = Array.from({ length: wordCount }, randomWord);
    const sentence = words.join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  const randomParagraph = (sentenceCount = getRandomInt(1, 7)) =>
    Array.from({ length: sentenceCount }, () => randomSentence()).join(" ");

  if (unit === "words") {
    return Array.from({ length }, randomWord).join(" ");
  }

  if (unit === "sentences") {
    return Array.from({ length }, () => randomSentence()).join(" ");
  }

  if (unit === "paragraphs") {
    return Array.from({ length }, () => randomParagraph()).join("\n\n");
  }

  return "";
}
