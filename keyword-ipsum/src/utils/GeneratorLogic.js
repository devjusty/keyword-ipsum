export function generateIpsum(keywords, length, unit) {
  const getCount = (unit) => {
    if (unit === "words") {
      return length;
    } else if (unit === "sentences") {
      return length;
    } else if (unit === "paragraphs") {
      return length;
    }
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random sentence using the keywords
  const randomSentence = (sentenceLength) => {
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

    const sentence = [];
    let wordCount = getRandomInt(3, 15);
    for (let i = 0; i < wordCount; i++) {
      if (Math.random() > 0.7 && keywords.length > 0) {
        sentence.push(keywords[Math.floor(Math.random() * keywords.length)]);
      } else {
        sentence.push(
          loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]
        );
      }
    }
    // Capitalize the first letter of the first word in the sentence
    const capitalizedSentence =
      sentence.join(" ").charAt(0).toUpperCase() + sentence.join(" ").slice(1);
    return capitalizedSentence + ".";
  };

  // Generate a random paragraph using the random sentence generator
  const getRandomParagraph = (paragraphLength) => {
    const paragraph = [];
    let sentenceCount = getRandomInt(1, 7);
    for (let i = 0; i < sentenceCount; i++) {
      paragraph.push(randomSentence());
    }
    return paragraph.join(" ");
  };

  // Generate the final Lorem Ipsum text using the random paragraph generator
  const generateLoremIpsumText = (count, unit) => {
    const text = [];
    for (let i = 0; i < count; i++) {
      if (unit === "paragraphs") {
        text.push(getRandomParagraph());
      } else if (unit === "sentences") {
        text.push(randomSentence());
      } else if (unit === "words") {
        text.push(randomSentence());
      }
    }
    return text.join("\n\n");
  };

  // Get the count based on the selected unit
  const count = getCount(unit);

  // Return the final Lorem Ipsum text
  return generateLoremIpsumText(count, unit);
}
